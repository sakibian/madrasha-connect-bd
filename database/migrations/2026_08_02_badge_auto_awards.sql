-- Badge Auto-Awarding System
-- Automatically awards badges when users reach XP milestones
-- NOTE: XP is stored in the user_xp table, not user_profiles

-- Function to award badges based on XP thresholds
CREATE OR REPLACE FUNCTION award_badges_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Award "First Steps" badge at 100 XP
  IF NEW.xp >= 100 AND (OLD.xp IS NULL OR OLD.xp < 100) THEN
    INSERT INTO user_badges (user_id, badge_id, awarded_at)
    VALUES (NEW.user_id, 'first-steps', NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Contributor" badge at 500 XP
  IF NEW.xp >= 500 AND (OLD.xp IS NULL OR OLD.xp < 500) THEN
    INSERT INTO user_badges (user_id, badge_id, awarded_at)
    VALUES (NEW.user_id, 'contributor', NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Community Leader" badge at 1000 XP
  IF NEW.xp >= 1000 AND (OLD.xp IS NULL OR OLD.xp < 1000) THEN
    INSERT INTO user_badges (user_id, badge_id, awarded_at)
    VALUES (NEW.user_id, 'leader', NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  -- Award "Elite Scholar" badge at 2500 XP
  IF NEW.xp >= 2500 AND (OLD.xp IS NULL OR OLD.xp < 2500) THEN
    INSERT INTO user_badges (user_id, badge_id, awarded_at)
    VALUES (NEW.user_id, 'elite-scholar', NOW())
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to user_xp table (NOT user_profiles)
-- XP is tracked in the separate user_xp table
DROP TRIGGER IF EXISTS trigger_award_badges ON user_xp;
CREATE TRIGGER trigger_award_badges
  AFTER INSERT OR UPDATE OF xp ON user_xp
  FOR EACH ROW
  WHEN (NEW.xp IS NOT NULL)
  EXECUTE FUNCTION award_badges_on_xp_change();

-- Manual badge award function for admins
CREATE OR REPLACE FUNCTION admin_award_badge(
  target_user_id UUID,
  badge_identifier TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_badges (user_id, badge_id, awarded_at)
  VALUES (target_user_id, badge_identifier, NOW())
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Manual badge removal function for admins
CREATE OR REPLACE FUNCTION admin_remove_badge(
  target_user_id UUID,
  badge_identifier TEXT
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM user_badges
  WHERE user_id = target_user_id AND badge_id = badge_identifier;
END;
$$ LANGUAGE plpgsql;
