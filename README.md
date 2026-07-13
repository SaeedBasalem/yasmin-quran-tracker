<div align="center">

# 📖 جدول متابعة حفظ القرآن — ياسمين

**تطبيق تفاعلي لمتابعة حفظ ومراجعة القرآن الكريم، بين المعلّم والطالبة، مع مزامنة سحابية.**

_An interactive Arabic (RTL) Quran memorization tracker — React + TypeScript + Supabase._

[![CI](https://github.com/SaeedBasalem/yasmin-quran-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/SaeedBasalem/yasmin-quran-tracker/actions/workflows/ci.yml)
[![Deploy](https://github.com/SaeedBasalem/yasmin-quran-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/SaeedBasalem/yasmin-quran-tracker/actions/workflows/deploy.yml)

</div>

---

## 🌟 نظرة عامة

هذا المشروع أداة أسبوعية تُعين المعلّم (سعيد) على متابعة رحلة الطالبة (ياسمين) في حفظ القرآن
الكريم: تسجيل الحفظ الجديد، والمراجعة القريبة والبعيدة، والالتزام بالورد والأذكار، ورصد أخطاء
التجويد، ومنح النجوم، وحساب الإحصاءات، وأرشفة الأسابيع — كلّ ذلك بواجهة عربية كاملة (RTL) تُحفظ
تلقائياً محلياً وسحابياً.

> نشأ المشروع كصفحة `index.html` واحدة (محفوظة في [`legacy/`](./legacy)) ثم أُعيدت هندسته إلى
> تطبيق احترافي منظّم بـ **React + TypeScript + Vite** وواجهة خلفية على **Supabase**، ليَسهُل
> تطويره وتوسيعه.

## ✨ الميزات

- **المتابعة اليومية:** جدول لسبعة أيام (الحفظ الجديد، التقدير، المراجعة القريبة/البعيدة، الورد،
  النجوم، ملاحظات التجويد) مع تلوين تلقائي لخانة التقدير.
- **التقدّم التراكمي:** عدّاد للصفحات المحفوظة (من 604)، حساب تقريبي للأجزاء، وشريط تقدّم مرئي.
- **أخطاء التجويد:** جدول قابل للتوسعة لرصد الأخطاء والأحكام ومتابعة تحسّنها.
- **التقييم الأسبوعي:** نجوم، تقدير عام، ملاحظة تشجيعية، وهدف الأسبوع القادم، ودعاء.
- **إحصاءات فورية:** أيام الحفظ، مجموع النجوم، الالتزام بالورد، وأيام «ممتاز».
- **الأرشفة:** حفظ الأسابيع السابقة واستعادتها في أي وقت.
- **الحفظ والمزامنة:** حفظ تلقائي في المتصفح (localStorage) + مزامنة سحابية عبر Supabase مع حلّ
  التعارض بالطابع الزمني (الأحدث يفوز).
- **التصدير/الاستيراد:** نسخ احتياطية بصيغة JSON.
- **الطباعة / PDF:** تنسيق مخصّص للطباعة (A4 أفقي).
- **إكمال تلقائي:** قائمة بأسماء السور الـ114 وخيارات التقدير.

## 🧱 التقنيات

| الطبقة        | الأداة                          |
| ------------- | ------------------------------ |
| الواجهة       | React 18 + TypeScript          |
| البناء        | Vite 5                         |
| الواجهة الخلفية | Supabase (PostgreSQL + RPC)    |
| التخزين المحلي | localStorage                   |
| الجودة        | ESLint + Prettier + tsc        |
| النشر         | GitHub Pages (Actions)         |

## 📁 هيكل المشروع

```
yasmin-quran-tracker/
├─ index.html                 # نقطة دخول Vite
├─ src/
│  ├─ main.tsx                # تركيب تطبيق React
│  ├─ App.tsx                 # تجميع الأقسام
│  ├─ components/             # مكوّنات الواجهة (TSX)
│  │  ├─ Header, Toolbar, StudentInfo, ProgressPanel
│  │  ├─ DailyTable, TajweedTable, StatsGrid
│  │  ├─ WeeklyEvaluation, Reminders
│  │  └─ StarRating, AutoTextarea, MushafIcon, *Datalist
│  ├─ store/
│  │  └─ tracker-store.tsx    # الحالة المركزية + المزامنة السحابية (Context)
│  ├─ lib/                    # منطق خالص وأدوات
│  │  ├─ env, supabase, storage, normalize
│  │  ├─ constants, grades, dates, stats
│  ├─ data/                   # بيانات JSON (السور، التذكيرات، التقديرات)
│  ├─ types/                  # أنواع TypeScript
│  └─ styles/index.css        # نظام التصميم
├─ supabase/
│  ├─ migrations/0001_init.sql
│  └─ config.toml
├─ legacy/                    # الإصدار المستقل الأصلي (صفحة واحدة)
└─ .github/workflows/         # CI + النشر
```

## 🚀 التشغيل محلياً

المتطلبات: **Node.js 18+**.

```bash
# 1) تثبيت الاعتماديات
npm install

# 2) إعداد متغيّرات البيئة
cp .env.example .env
#   ثم عدّل القيم إن لزم (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_TRACKER_ID)

# 3) تشغيل خادم التطوير
npm run dev

# 4) البناء للإنتاج
npm run build && npm run preview
```

> إذا تُركت متغيّرات Supabase فارغة، يعمل التطبيق **محلياً فقط** (localStorage) دون مزامنة.

### الأوامر المتاحة

| الأمر               | الوظيفة                          |
| ------------------- | ------------------------------- |
| `npm run dev`       | خادم تطوير مع إعادة تحميل فورية  |
| `npm run build`     | فحص الأنواع + بناء الإنتاج       |
| `npm run preview`   | معاينة ناتج البناء              |
| `npm run typecheck` | فحص أنواع TypeScript فقط         |
| `npm run lint`      | فحص ESLint                       |
| `npm run format`    | تنسيق الشيفرة بـ Prettier        |
| `npm run deploy`    | نشر يدوي إلى GitHub Pages        |

## ☁️ إعداد Supabase

1. أنشئ مشروعاً على [supabase.com](https://supabase.com).
2. طبّق مخطط قاعدة البيانات:
   - إمّا عبر لوحة Supabase → **SQL Editor** بلصق محتوى
     [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)،
   - أو عبر واجهة CLI:
     ```bash
     supabase link --project-ref <your-ref>
     supabase db push
     ```
3. انسخ `Project URL` و `anon/publishable key` من **Project Settings → API** إلى ملف `.env`.

**نموذج البيانات:** جدول `trackers` يحوي صفاً واحداً لكل طالبة (`id`)، بمحتوى كامل داخل عمود
`data` (JSONB) — الأسبوع الحالي + الأرشيف. كل الوصول يمرّ عبر دالتَي RPC آمنتَين
(`tracker_save` / `tracker_load`) مع تفعيل Row Level Security على الجدول، بينما تبقى المزامنة
مفتوحة (بدون رمز PIN) لتبسيط الاستخدام العائلي.

> 🔐 **ملاحظة أمنية:** المفتاح المستخدم في المتصفح هو المفتاح العام (publishable/anon) وهو آمن
> للعرض. لرفع مستوى الحماية لاحقاً يمكن إعادة تفعيل رمز PIN (متوفّر في
> [`legacy/standalone-pin.html`](./legacy/standalone-pin.html)) أو ربط Supabase Auth.

## 🌐 النشر

يُنشر التطبيق تلقائياً إلى **GitHub Pages** عند كل دفع إلى `main` عبر
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). قبل أول نشر:

1. فعّل GitHub Pages: **Settings → Pages → Source = GitHub Actions**.
2. أضِف الأسرار (اختياري، للمزامنة السحابية أثناء البناء): **Settings → Secrets and variables →
   Actions** ثم أضِف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` و `VITE_TRACKER_ID`.

> إن كان اسم المستودع مختلفاً، عدّل `base` في [`vite.config.ts`](./vite.config.ts) أو مرّر
> `VITE_BASE=/` عند النشر على نطاق جذري.

## 🗂️ الإصدار المستقل (Legacy)

مجلّد [`legacy/`](./legacy) يحتفظ بالنسخة الأصلية ذات الملف الواحد للرجوع إليها:

- `standalone.html` — أحدث نسخة مستقلة (مزامنة مفتوحة بلا PIN).
- `standalone-pin.html` — نسخة سابقة محمية برمز PIN.

كلاهما يعمل بفتحه مباشرة في المتصفح دون أي بناء.

## 🤝 المساهمة

نرحّب بالتحسينات. الرجاء تشغيل `npm run typecheck && npm run lint && npm run build` قبل فتح أي
Pull Request. أفكار مقترحة للتطوير: رسوم بيانية للتقدّم، تعدّد الطالبات، تسجيل دخول Supabase Auth،
تصدير PDF مباشر، ووضع ليلي.

## 📜 الرخصة

[MIT](./LICENSE) © 2026 Saeed Basalem

<div align="center">

_«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»_

</div>
