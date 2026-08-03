import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSession = { user: { id: 'user-123' } };

const mockSupabase = {
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: mockSession }, error: null })),
  },
  from: vi.fn(),
};

vi.mock('../../../services/supabase', () => ({
  supabase: mockSupabase,
}));

const RESOLVED_VALUE = { data: null, error: null };

function createMockChain() {
  const chain: any = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    neq: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    upsert: vi.fn(() => chain),
    order: vi.fn(() => chain),
    maybeSingle: vi.fn(() => Promise.resolve(RESOLVED_VALUE)),
    single: vi.fn(() => Promise.resolve(RESOLVED_VALUE)),
    limit: vi.fn(() => chain),
    in: vi.fn(() => chain),
    ilike: vi.fn(() => chain),
    rpc: vi.fn(() => Promise.resolve(RESOLVED_VALUE)),
  };
  chain.then = vi.fn((resolve: any) => resolve(RESOLVED_VALUE));
  return chain;
}

describe('dataService User CRUD operations', () => {
  let dataService: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockSupabase.auth.getSession.mockReturnValue(
      Promise.resolve({ data: { session: mockSession }, error: null })
    );
    dataService = (await import('../../../services/dataService')).dataService;
  });

  describe('updateComment', () => {
    it('calls supabase with correct params', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.updateComment('comment-1', 'Updated content');

      expect(mockSupabase.from).toHaveBeenCalledWith('forum_comments');
      expect(chain.update).toHaveBeenCalledWith({ content: 'Updated content' });
      expect(chain.eq).toHaveBeenCalledWith('id', 'comment-1');
      expect(chain.eq).toHaveBeenCalledWith('author_id', 'user-123');
    });
  });

  describe('deleteComment', () => {
    it('deletes via supabase with auth check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.deleteComment('comment-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('forum_comments');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 'comment-1');
      expect(chain.eq).toHaveBeenCalledWith('author_id', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.deleteComment('comment-1')).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('updateFatwa', () => {
    it('updates question and category with ownership check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.updateFatwa('fatwa-1', { question: 'Updated?', category: 'Family' });

      expect(mockSupabase.from).toHaveBeenCalledWith('fatwas');
      expect(chain.update).toHaveBeenCalledWith({ question: 'Updated?', category: 'Family' });
      expect(chain.eq).toHaveBeenCalledWith('id', 'fatwa-1');
      expect(chain.eq).toHaveBeenCalledWith('asked_by', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.updateFatwa('fatwa-1', { question: 'Updated?' })).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('deleteFatwa', () => {
    it('deletes own fatwa with auth check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.deleteFatwa('fatwa-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('fatwas');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 'fatwa-1');
      expect(chain.eq).toHaveBeenCalledWith('asked_by', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.deleteFatwa('fatwa-1')).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('withdrawJobApplication', () => {
    it('deletes application with auth check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.withdrawJobApplication('app-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('job_applications');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 'app-1');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.withdrawJobApplication('app-1')).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('updateDonorProfile', () => {
    it('updates donor fields with snake_case mapping', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.updateDonorProfile({
        bloodGroup: 'O+',
        location: 'Mirpur',
        district: 'Dhaka',
        phone: '01712345678',
        publicProfile: true,
      });

      expect(mockSupabase.from).toHaveBeenCalledWith('blood_donors');
      expect(chain.update).toHaveBeenCalledWith({
        blood_group: 'O+',
        location: 'Mirpur',
        district: 'Dhaka',
        phone: '01712345678',
        public_profile: true,
      });
    });

    it('ignores undefined fields', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.updateDonorProfile({ bloodGroup: 'AB-', location: 'Gulshan' });

      const updateCall = chain.update.mock.calls[0][0];
      expect(updateCall).not.toHaveProperty('phone');
      expect(updateCall).not.toHaveProperty('district');
      expect(updateCall.blood_group).toBe('AB-');
      expect(updateCall.location).toBe('Gulshan');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.updateDonorProfile({ bloodGroup: 'O+' })).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('updatePost', () => {
    it('updates post with ownership check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.updatePost('post-1', { title: 'Updated', content: 'New content' });

      expect(mockSupabase.from).toHaveBeenCalledWith('forum_posts');
      expect(chain.update).toHaveBeenCalledWith({ title: 'Updated', content: 'New content' });
      expect(chain.eq).toHaveBeenCalledWith('id', 'post-1');
      expect(chain.eq).toHaveBeenCalledWith('author_id', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.updatePost('post-1', { title: 'X' })).rejects.toThrow(
        'Must be logged in to edit'
      );
    });
  });

  describe('deletePost', () => {
    it('deletes post with ownership check', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.deletePost('post-1');

      expect(mockSupabase.from).toHaveBeenCalledWith('forum_posts');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 'post-1');
      expect(chain.eq).toHaveBeenCalledWith('author_id', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.deletePost('post-1')).rejects.toThrow(
        'Must be logged in'
      );
    });
  });

  describe('getMyProfile', () => {
    it('returns null when not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      const result = await dataService.getMyProfile();
      expect(result).toBeNull();
    });
  });

  describe('saveMyProfile', () => {
    it('updates profile with updated_at timestamp', async () => {
      const chain = createMockChain();
      mockSupabase.from.mockReturnValue(chain);

      await dataService.saveMyProfile({ name: 'Updated Name', bio: 'New bio' });

      expect(mockSupabase.from).toHaveBeenCalledWith('user_profiles');
      const updateCall = chain.update.mock.calls[0][0];
      expect(updateCall.name).toBe('Updated Name');
      expect(updateCall.bio).toBe('New bio');
      expect(updateCall).toHaveProperty('updated_at');
      expect(chain.eq).toHaveBeenCalledWith('id', 'user-123');
    });

    it('throws if not logged in', async () => {
      mockSupabase.auth.getSession.mockReturnValue(
        Promise.resolve({ data: { session: null }, error: null })
      );
      mockSupabase.from.mockReturnValue(createMockChain());

      await expect(dataService.saveMyProfile({ name: 'X' })).rejects.toThrow(
        'Must be logged in'
      );
    });
  });
});
