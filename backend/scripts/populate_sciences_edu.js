/**
 * Master population script for Sciences de l'Éducation (Curriculum officiel Tawsif).
 * 
 * 3 Grand Modules (100%) :
 *  - Module 1 : علم النفس التربوي (40%)
 *      * EDU_DEV (20%) : 9 cours (IDs 301-309)
 *      * EDU_APPR (20%) : 10 cours (IDs 310-319)
 *  - Module 2 : المقاربات البيداغوجية وطرائق التدريس (30%)
 *      * EDU_APPROCHES (15%) : 7 cours (IDs 320-326)
 *      * EDU_METHODES (15%) : 10 cours (IDs 327-336)
 *  - Module 3 : سوسيولوجيا التربية (30%)
 *      * EDU_SOCIO (15%) : 9 cours (IDs 337-345)
 *      * EDU_GROUPE (15%) : 10 cours (IDs 346-355)
 * Total : 55 cours complets bilingues avec structure unifiée (7 sections).
 * 
 * Synchronise SQLite (backend/db.sqlite3) et backend/initial_data.json.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Load module data
const { mod1DevLessons } = require('./sciences_edu_data/mod1_dev.js');
const { mod1ApprLessons } = require('./sciences_edu_data/mod1_appr.js');
const { mod2ApprochesLessons } = require('./sciences_edu_data/mod2_approches.js');
const { mod2MethodesLessons } = require('./sciences_edu_data/mod2_methodes.js');
const { mod3SocioLessons } = require('./sciences_edu_data/mod3_socio.js');
const { mod3GroupeLessons } = require('./sciences_edu_data/mod3_groupe.js');

const allLessons = [
  ...mod1DevLessons,
  ...mod1ApprLessons,
  ...mod2ApprochesLessons,
  ...mod2MethodesLessons,
  ...mod3SocioLessons,
  ...mod3GroupeLessons,
];

console.log(`Loaded ${allLessons.length} lessons from data modules.`);

// Subdomains definition
const subdomains = [
  {
    code: 'EDU_DEV',
    domain: 'SCIENCES_EDU',
    name: "Psychologie du développement (20%)",
    description: "علم نفس النمو – مفاهيمه، مراحله، ونظرياته الكبرى (بياجي، فرويد، إريكسون، فيغوتسكي)"
  },
  {
    code: 'EDU_APPR',
    domain: 'SCIENCES_EDU',
    name: "Psychologie de l'apprentissage (20%)",
    description: "علم نفس التعلم – نظريات التعلم، شروطه، الدافعية، الذاكرة، وعوائق التعلم"
  },
  {
    code: 'EDU_APPROCHES',
    domain: 'SCIENCES_EDU',
    name: "De la PPO à l'APC (15%)",
    description: "المقاربات البيداغوجية – من بيداغوجيا الأهداف إلى المقاربة بالكفايات وبيداغوجيا الإدماج"
  },
  {
    code: 'EDU_METHODES',
    domain: 'SCIENCES_EDU',
    name: "Méthodes d'enseignement (15%)",
    description: "طرائق التدريس واستراتيجيات التعليم والتعلم – حل المشكلات، المشروع، التمايز، والتقويم"
  },
  {
    code: 'EDU_SOCIO',
    domain: 'SCIENCES_EDU',
    name: "Sociologie de l'éducation (15%)",
    description: "سوسيولوجيا التربية – التنشئة الاجتماعية، إعادة الإنتاج، العدالة المدرسية، وإصلاحات التعليم"
  },
  {
    code: 'EDU_GROUPE',
    domain: 'SCIENCES_EDU',
    name: "Dynamique de groupe (15%)",
    description: "دينامية الجماعة – جماعة القسم، أنماط القيادة، السوسيومترية، والتواصل التربوي"
  }
];

// Open SQLite DB
const dbPath = path.resolve(__dirname, '../db.sqlite3');
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = OFF;");

// 1. Ensure subdomains exist in SQLite
const checkSubStmt = db.prepare("SELECT code FROM syllabus_subdomain WHERE code = ?");
const insertSubStmt = db.prepare("INSERT INTO syllabus_subdomain (code, domain_id, name, description) VALUES (?, ?, ?, ?)");
const updateSubStmt = db.prepare("UPDATE syllabus_subdomain SET name = ?, description = ? WHERE code = ?");

for (const sub of subdomains) {
  const existing = checkSubStmt.get(sub.code);
  if (existing) {
    updateSubStmt.run(sub.name, sub.description, sub.code);
  } else {
    insertSubStmt.run(sub.code, sub.domain, sub.name, sub.description);
  }
}
console.log('Subdomains verified and updated in SQLite.');

// 2. Ensure columns exist in syllabus_course
const cols = db.prepare("PRAGMA table_info(syllabus_course)").all().map(c => c.name);
const neededCols = [
  ['title_ar', 'TEXT'],
  ['content_ar', 'TEXT'],
  ['content_fr', 'TEXT'],
  ['examples_ar', 'TEXT'],
  ['examples_fr', 'TEXT'],
  ['astuces_ar', 'TEXT'],
  ['astuces_fr', 'TEXT'],
  ['video_url', 'TEXT']
];

for (const [colName, colType] of neededCols) {
  if (!cols.includes(colName)) {
    console.log(`Adding missing column ${colName} to syllabus_course...`);
    db.exec(`ALTER TABLE syllabus_course ADD COLUMN ${colName} ${colType};`);
  }
}

// 3. Upsert 55 courses
const checkCourseStmt = db.prepare("SELECT id FROM syllabus_course WHERE id = ?");
const insertCourseStmt = db.prepare(`
  INSERT INTO syllabus_course (
    id, subdomain_id, title, title_ar, content, content_ar, content_fr,
    examples, examples_ar, examples_fr, astuces, astuces_ar, astuces_fr, video_url
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?
  )
`);

const updateCourseStmt = db.prepare(`
  UPDATE syllabus_course SET
    subdomain_id = ?,
    title = ?,
    title_ar = ?,
    content = ?,
    content_ar = ?,
    content_fr = ?,
    examples = ?,
    examples_ar = ?,
    examples_fr = ?,
    astuces = ?,
    astuces_ar = ?,
    astuces_fr = ?,
    video_url = ?
  WHERE id = ?
`);

let insertedCount = 0;
let updatedCount = 0;

for (const lesson of allLessons) {
  const existing = checkCourseStmt.get(lesson.id);
  const videoUrl = lesson.video_url || null;

  if (existing) {
    updateCourseStmt.run(
      lesson.subdomain,
      lesson.title,
      lesson.title_ar,
      lesson.content_ar, // fallback content
      lesson.content_ar,
      lesson.content_fr,
      lesson.examples_ar || '',
      lesson.examples_ar || '',
      lesson.examples_fr || '',
      lesson.astuces_ar || '',
      lesson.astuces_ar || '',
      lesson.astuces_fr || '',
      videoUrl,
      lesson.id
    );
    updatedCount++;
  } else {
    insertCourseStmt.run(
      lesson.id,
      lesson.subdomain,
      lesson.title,
      lesson.title_ar,
      lesson.content_ar,
      lesson.content_ar,
      lesson.content_fr,
      lesson.examples_ar || '',
      lesson.examples_ar || '',
      lesson.examples_fr || '',
      lesson.astuces_ar || '',
      lesson.astuces_ar || '',
      lesson.astuces_fr || '',
      videoUrl
    );
    insertedCount++;
  }
}

console.log(`Courses in SQLite: ${insertedCount} inserted, ${updatedCount} updated.`);

// 4. Clean up older courses 36, 37, 38, 39
const c38Row = db.prepare("SELECT content_ar FROM syllabus_course WHERE id = 38").get();
if (c38Row && c38Row.content_ar) {
  let cleaned38 = c38Row.content_ar;
  if (cleaned38.includes('بالتأكيد، بصفتي أستاذاً خبيراً')) {
    const dividerIdx = cleaned38.indexOf('---');
    if (dividerIdx !== -1) {
      cleaned38 = cleaned38.slice(dividerIdx + 3).trim();
    }
  }
  db.prepare(`
    UPDATE syllabus_course SET
      title_ar = 'سوسيولوجيا التربية، المناخ المدرسي ودينامية الفصل',
      content_ar = ?
    WHERE id = 38
  `).run(cleaned38);
  console.log('Cleaned course 38 conversational text.');
}

db.prepare(`
  UPDATE syllabus_course SET
    title_ar = 'نظريات التعلم الكبرى (السلوكية، البنائية، السوسيوبنائية، المعرفية)'
  WHERE id = 36
`).run();

db.prepare(`
  UPDATE syllabus_course SET
    title_ar = 'سيكولوجية نمو المراهق والعمليات المعرفية'
  WHERE id = 37
`).run();

db.prepare(`
  UPDATE syllabus_course SET
    title_ar = 'التربية الدامجة، الإنصاف، تكافؤ الفرص وأخلاقيات المهنة'
  WHERE id = 39
`).run();

console.log('Updated titles_ar for courses 36, 37, 39.');

// 5. Sync backend/initial_data.json
const jsonPath = path.resolve(__dirname, '../initial_data.json');
let initialData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Update/Add subdomains in initialData
for (const sub of subdomains) {
  const existingIdx = initialData.findIndex(item => item.model === 'syllabus.subdomain' && item.pk === sub.code);
  const subRecord = {
    model: 'syllabus.subdomain',
    pk: sub.code,
    fields: {
      domain: sub.domain,
      name: sub.name,
      description: sub.description
    }
  };
  if (existingIdx !== -1) {
    initialData[existingIdx] = subRecord;
  } else {
    initialData.push(subRecord);
  }
}

// Update/Add the 55 courses in initialData
for (const lesson of allLessons) {
  const existingIdx = initialData.findIndex(item => item.model === 'syllabus.course' && item.pk === lesson.id);
  const courseRecord = {
    model: 'syllabus.course',
    pk: lesson.id,
    fields: {
      subdomain: lesson.subdomain,
      title: lesson.title,
      title_ar: lesson.title_ar,
      content: lesson.content_ar,
      content_ar: lesson.content_ar,
      content_fr: lesson.content_fr,
      examples: lesson.examples_ar || '',
      examples_ar: lesson.examples_ar || '',
      examples_fr: lesson.examples_fr || '',
      astuces: lesson.astuces_ar || '',
      astuces_ar: lesson.astuces_ar || '',
      astuces_fr: lesson.astuces_fr || '',
      video_url: lesson.video_url || null
    }
  };
  if (existingIdx !== -1) {
    initialData[existingIdx] = courseRecord;
  } else {
    initialData.push(courseRecord);
  }
}

// Also update courses 36, 37, 38, 39 in initialData
[36, 37, 38, 39].forEach(id => {
  const idx = initialData.findIndex(item => item.model === 'syllabus.course' && item.pk === id);
  if (idx !== -1) {
    const row = db.prepare("SELECT title_ar, content_ar FROM syllabus_course WHERE id = ?").get(id);
    if (row) {
      initialData[idx].fields.title_ar = row.title_ar;
      initialData[idx].fields.content_ar = row.content_ar;
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(initialData, null, 2), 'utf8');
console.log(`Successfully synced backend/initial_data.json with ${allLessons.length} new courses and updated subdomains.`);

db.exec("PRAGMA foreign_keys = ON;");
console.log('All operations completed successfully!');
