# 🚀 Antigravity Arabic Enhancer (أنتيجرافيتي بالعربي)

> **أداة متكاملة وإضافة مفتوحة المصدر لإصلاح وتجميل عرض اللغة العربية والنصوص ثنائية الاتجاه (RTL & BiDi) في تطبيق ومساعد Google Antigravity.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](#)
[![Antigravity](https://img.shields.io/badge/Antigravity-Supported-green)](#)

---

## 🧐 المشكلة التي نحلها (Why this exists)

عند استخدام الذكاء الاصطناعي في Antigravity باللغة العربية، يواجه المستخدمون مشاكل مزعجة جداً في عرض النصوص:
1. **انعكاس الكلمات (BiDi Jumble):** عند كتابة كود أو مصطلح إنجليزي داخل فقرة عربية، تنعكس الكلمات التي قبله وبعده، وتتحرك علامات الترقيم (كالنقطة `.` والاستفهام `؟` والأقواس) إلى أقصى الطرف المعاكس.
2. **محاذاة خاطئة (LTR):** تبدأ الرسائل العربية من اليسار بدلاً من اليمين، مما يجعل القراءة مربكة وصعبة.
3. **حقل كتابة الرسائل (Input Field):** المؤشر (Cursor) يسبق الحروف أو يقف في الجانب الخاطئ عند الكتابة.
4. **عناوين المحادثات في القائمة الجانبية:** تظهر مشوهة إذا احتوت على عربي وإنجليزي أو أرقام.

**أداة `antigravity-arabic` تحل هذه المشاكل بالكامل تلقائياً وفورياً!**

---

## ✨ المميزات الرئيسية (Features)

- ✅ **توجيه تلقائي ذكي (Smart RTL Auto-Detection):** رصد أي محتوى عربي تلقائياً وضبط اتجاهه إلى اليمين (`dir="rtl"`) دون التأثير على الأكواد والإنجليزية.
- ✅ **عزل الأكواد والمصطلحات الإنجليزية (BiDi Isolation):** عزل الأكواد المضمنة (Inline Code) والروابط والمصطلحات الإنجليزية بحيث لا تعكس الجملة العربية إطلاقاً.
- ✅ **مراقبة حية أثناء البث (Streaming MutationObserver):** معالجة الردود لحظة بلحظة أثناء توليد الذكاء الاصطناعي للكلمات (Token Streaming).
- ✅ **تحسين كتابة الشات (Smart Chat Input):** مربع الإدخال يتحول تلقائياً إلى اليمين عند كتابة عربي، وإلى اليسار عند كتابة إنجليزي أو كود.
- ✅ **قواعد ذكاء اصطناعي مدمجة (AI Agent Rules):** إضافة مدمجة تُلزم الموديل باتباع أفضل معايير صياغة Markdown لتفادي اللخبطة من المصدر.
- ✅ **خطوط عربية مريحة للعين (Typography):** تحسين تباعد الأسطر (Line-height) والخطوط (Segoe UI / Cairo / Tahoma).
- ✅ **تثبيت دائم بضغطة زر (One-Click Permanent Install):** يتم تثبيته كإضافة رسمية وخطاف تشغيل (Lifecycle Hook) يعمل تلقائياً مع فتح Antigravity.

---

## 📦 التثبيت السريع (Quick Start)

### 1. التثبيت الدائم (الموصى به)

افتح الطرفية (Terminal / PowerShell) واستنسخ المشروع:

```bash
git clone https://github.com/herohonor123/antigravity-arabic.git
cd antigravity-arabic
```

ثم نفّذ أمر التثبيت:

#### على ويندوز (Windows):
```powershell
.\install.ps1
```
أو عبر `npm`:
```bash
npm run install-plugin
```

#### على ماك ولينكس (macOS / Linux):
```bash
chmod +x ./install.sh
./install.sh
```

> **ماذا يفعل أمر التثبيت؟**
> يقوم بنسخ الإضافة إلى مجلد إضافات Antigravity الرسمي (`~/.gemini/config/plugins/antigravity-arabic`)، وتفعيل قواعد الذكاء الاصطناعي وخطاف التشغيل التلقائي (`SessionStart Hook`).

---

### 2. الإصلاح الفوري السريع (بدون تثبيت دائم)

إذا كنت فاتح Antigravity وتريد إصلاح النافذة الحالية فوراً:

```bash
npm start
```
أو:
```bash
node ./bin/cli.js inject
```

---

## 🛠️ أوامر الأداة (CLI Commands)

| الأمر | الوظيفة |
| :--- | :--- |
| `node bin/cli.js inject` | فحص النوافذ المفتوحة وتطبيق إصلاح العربي فوراً على النافذة النشطة. |
| `node bin/cli.js install` | التثبيت الدائم للإضافة والقواعد داخل إعدادات Antigravity. |
| `node bin/cli.js status` | إظهار حالة Antigravity (هل التطبيق يعمل؟ هل الإضافة مثبتة؟). |
| `node bin/cli.js daemon` | تشغيل مراقب خلفي يراقب تشغيل Antigravity ويصلح أي نافذة جديدة فور فتحها. |
| `node bin/cli.js uninstall` | إزالة الإضافة والقواعد من إعدادات Antigravity نظيفاً. |

---

## 🏗️ كيف تعمل الأداة تحت الغطاء؟ (Architecture)

1. **Layer 1: Chrome DevTools Protocol Engine (`lib/injector.js`):**
   - يتصل بمنفذ التحكم لـ Electron المفتوح لتطبيق Antigravity.
   - يحقن محرك المراقبة والأنماط مباشرة داخل صفحة العرض (Renderer).

2. **Layer 2: Realtime DOM Observer (`lib/arabic-observer.js`):**
   - يعمل داخل النافذة باستخدام `MutationObserver`.
   - يفحص العقد النصية عبر تعبير نمطي فائق السرعة لتمييز النصوص العربية `[\u0600-\u06FF]`.
   - يطبق فئات CSS مع خاصية `unicode-bidi: plaintext` و `unicode-bidi: isolate` للمصطلحات الإنجليزية.

3. **Layer 3: Agent BiDi Rules (`plugin/rules/AGENTS.md`):**
   - قاعدة يتم حقنها تلقائياً للموديل لتوجيهه لكتابة ردود Markdown معزولة المصطلحات التقنية.

4. **Layer 4: Antigravity Lifecycle Hooks (`plugin/hooks.json`):**
   - يضمن تشغيل الحاقن تلقائياً عند بدء أي جلسة جديدة (`SessionStart`).

---

## 🤝 المساهمة (Contributing)

المشروع مفتوح المصدر بالكامل لمجتمع المطورين العرب! نرحب بأي مساهمات، سواء في إضافة دعم لمحررات أخرى أو تحسين الخطوط والتنسيقات:
1. Fork للمستودع.
2. أنشئ فرع للميزة: `git checkout -b feature/awesome-fix`.
3. اعمل Commit للتغييرات: `git commit -m "Add new feature"`.
4. ادفع للفرع: `git push origin feature/awesome-fix`.
5. افتح Pull Request.

---

## 📄 الترخيص (License)

هذا المشروع مرخص تحت رخصة **MIT** - راجع ملف [LICENSE](LICENSE) لمزيد من التفاصيل.
