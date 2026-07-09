#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables.');
  console.error('Required:');
  console.error('  SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generatePassword(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function seedAdmin() {
  console.log('Starting admin seed...\n');

  const adminEmail = 'admin@madrasaconnectbd.com';
  const adminPassword = generatePassword();

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    process.exit(1);
  }

  const existingUser = existingUsers?.users?.find(u => u.email === adminEmail);
  if (existingUser) {
    console.log(`Admin user ${adminEmail} already exists (ID: ${existingUser.id}). Skipping creation.`);
    return existingUser.id;
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (authError) {
    console.error('Error creating admin user:', authError.message);
    process.exit(1);
  }

  console.log(`Created admin user: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`User ID: ${authData.user.id}`);

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      email: adminEmail,
      role: 'ADMIN',
    });

  if (profileError) {
    console.error('Error creating admin profile:', profileError.message);
  } else {
    console.log('Created admin profile with role: ADMIN');
  }

  return authData.user.id;
}

async function seedJobs() {
  console.log('\nSeeding jobs...');
  const { data: existing } = await supabase.from('jobs').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Jobs already exist. Skipping.');
    return;
  }

  const jobs = [
    { title: 'Arabic Language Teacher', description: 'Teach Arabic language and literature to madrasa students', location: 'Dhaka', type: 'full_time', status: 'active' },
    { title: 'Islamic Studies Instructor', description: 'Teach Quranic studies and Islamic history', location: 'Chittagong', type: 'full_time', status: 'active' },
    { title: 'Islamic Finance Consultant', description: 'Advise on Sharia-compliant financial products', location: 'Dhaka', type: 'contract', status: 'active' },
    { title: 'Hifz Teacher', description: 'Memorization guidance for Quran students', location: 'Sylhet', type: 'part_time', status: 'active' },
    { title: 'Madrasa Administrator', description: 'Manage day-to-day operations of the institution', location: 'Rajshahi', type: 'full_time', status: 'active' },
  ];

  const { data, error } = await supabase.from('jobs').insert(jobs);
  if (error) {
    console.error('Error seeding jobs:', error.message);
  } else {
    console.log(`Created ${data.length} jobs.`);
  }
}

async function seedInstitutions() {
  console.log('\nSeeding institutions...');
  const { data: existing } = await supabase.from('institutions').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Institutions already exist. Skipping.');
    return;
  }

  const institutions = [
    { name: 'Al-Azhar Madrasa', location: 'Dhaka', description: 'Premier Islamic education institution in Dhaka', type: 'madrasa' },
    { name: 'Darul Uloom Chittagong', location: 'Chittagong', description: 'Center for Islamic scholarship since 1952', type: 'madrasa' },
    { name: 'Bangladesh Islamic University', location: 'Comilla', description: 'University-level Islamic education', type: 'university' },
  ];

  const { data, error } = await supabase.from('institutions').insert(institutions);
  if (error) {
    console.error('Error seeding institutions:', error.message);
  } else {
    console.log(`Created ${data.length} institutions.`);
  }
}

async function seedFatwas() {
  console.log('\nSeeding fatwas...');
  const { data: existing } = await supabase.from('fatwas').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('Fatwas already exist. Skipping.');
    return;
  }

  const fatwas = [
    { question: 'Is online Islamic education valid?', answer: 'Yes, online Islamic education is permissible as long as the curriculum is authentic and taught by qualified scholars.', category: 'education' },
    { question: 'What is the ruling on Islamic banking?', answer: 'Islamic banking is permissible under Sharia law when it avoids interest (riba) and follows Sharia-compliant principles.', category: 'finance' },
    { question: 'Can women attend madrasa?', answer: 'Yes, Islamic education is encouraged for both men and women. Many madrasas offer separate programs for women.', category: 'education' },
  ];

  const { data, error } = await supabase.from('fatwas').insert(fatwas);
  if (error) {
    console.error('Error seeding fatwas:', error.message);
  } else {
    console.log(`Created ${data.length} fatwas.`);
  }
}

async function main() {
  try {
    await seedAdmin();
    await seedJobs();
    await seedInstitutions();
    await seedFatwas();
    console.log('\nSeeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

main();
