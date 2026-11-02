"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react"

type Locale = "en" | "fa"
type TranslationValues = Record<string, string | number>
type Translator = (text: string, values?: TranslationValues) => string

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translator
}

const translations: Record<Locale, Record<string, string>> = {
  en: {},
  fa: {
    "Switch language": "تغییر زبان",
    "Language": "زبان",
    "Changing language...": "در حال تغییر زبان...",
    "Switch language to English": "تغییر زبان به انگلیسی",
    "Dashboard": "داشبورد",
    "Projects": "پروژه‌ها",
    "AI Analysis": "تحلیل هوش مصنوعی",
    "Settings": "تنظیمات",
    "AI credits": "اعتبار هوش مصنوعی",
    "Resets in {days} days": "{days} روز دیگر بازنشانی می‌شود",
    "Active projects": "پروژه‌های فعال",
    "+1 this month": "+۱ در این ماه",
    "Tasks completed": "وظایف تکمیل‌شده",
    "72% completion rate": "۷۲٪ نرخ تکمیل",
    "Overall progress": "پیشرفت کلی",
    "+8% this week": "+۸٪ در این هفته",
    "Projects at risk": "پروژه‌های در معرض خطر",
    "Needs your attention": "نیازمند توجه شما",
    "8 completed this week": "۸ وظیفه تکمیل‌شده در این هفته",
    "Needs attention": "نیازمند توجه",
    "1 critical blocker": "۱ مانع بحرانی",
    "MONDAY, OCTOBER 6": "دوشنبه، ۶ اکتبر",
    "Good morning, Alex": "صبح بخیر، الکس",
    "Here’s what’s happening across your projects today.": "وضعیت امروز پروژه‌های شما در یک نگاه.",
    "Current projects in your workspace": "پروژه‌های جاری در فضای کاری شما",
    "Completed across all projects": "تکمیل‌شده در همه پروژه‌ها",
    "{count} total tasks": "مجموعاً {count} وظیفه",
    "Based on completed tasks": "بر اساس وظایف تکمیل‌شده",
    "Projects past their deadline": "پروژه‌های گذشته از مهلت نهایی",
    "No projects yet.": "هنوز پروژه‌ای وجود ندارد.",
    "Unable to load dashboard.": "بارگذاری داشبورد ممکن نیست.",
    "Recent projects": "پروژه‌های اخیر",
    "Your most active workspaces": "فعال‌ترین فضاهای کاری شما",
    "View project": "مشاهده پروژه",
    "AI attention center": "مرکز توجه هوش مصنوعی",
    "Priorities detected across your work": "اولویت‌های شناسایی‌شده در کارهای شما",
    "Critical": "بحرانی",
    "Authentication is blocking 4 tasks": "احراز هویت مانع انجام ۴ وظیفه شده است",
    "Resolve the authentication flow in E-commerce Platform to unblock checkout and account work.": "جریان احراز هویت پلتفرم تجارت الکترونیک را تکمیل کنید تا کارهای پرداخت و حساب کاربری آغاز شوند.",
    "Review AI insight": "بررسی بینش هوش مصنوعی",
    "Due this week": "سررسید این هفته",
    "Today": "امروز",
    "Urgent": "فوری",
    "Medium": "متوسط",
    "Low": "کم",
    "WORKSPACE": "فضای کاری",
    "Plan, prioritize, and ship your best work.": "برنامه‌ریزی کنید، اولویت‌بندی کنید و بهترین کارتان را ارائه دهید.",
    "All projects": "همه پروژه‌ها",
    "{count} active projects": "{count} پروژه فعال",
    "Search projects": "جستجوی پروژه‌ها",
    "Search projects...": "جستجوی پروژه‌ها...",
    "Filter projects": "فیلتر پروژه‌ها",
    "Filter": "فیلتر",
    "All": "همه",
    "On track": "طبق برنامه",
    "Medium risk": "ریسک متوسط",
    "At risk": "در معرض خطر",
    "Unable to load projects.": "بارگذاری پروژه‌ها ممکن نیست.",
    "Loading projects...": "در حال بارگذاری پروژه‌ها...",
    "No projects match your search.": "پروژه‌ای با این جستجو پیدا نشد.",
    "Progress": "پیشرفت",
    "{completed}/{total} tasks": "{completed} از {total} وظیفه",
    "Open {title}": "باز کردن {title}",
    "New Project": "پروژه جدید",
    "Create a new project": "ایجاد پروژه جدید",
    "Add the project details. You can plan tasks after saving.": "جزئیات پروژه را وارد کنید. پس از ذخیره می‌توانید برای آن برنامه‌ریزی کنید.",
    "Project name": "نام پروژه",
    "Enter a project name": "نام پروژه را وارد کنید",
    "Project goal": "هدف پروژه",
    "Describe the project goal (optional)": "هدف پروژه را توضیح دهید (اختیاری)",
    "Deadline": "مهلت نهایی",
    "Open deadline calendar": "باز کردن تقویم مهلت نهایی",
    "Project planning": "برنامه‌ریزی پروژه",
    "This form saves the project name, goal, and optional deadline. You can add milestones and tasks afterward.": "این فرم نام، هدف و مهلت اختیاری پروژه را ذخیره می‌کند. پس از آن می‌توانید نقاط عطف و وظایف را اضافه کنید.",
    "Cancel": "لغو",
    "Create Project": "ایجاد پروژه",
    "Creating...": "در حال ایجاد...",
    "No description yet.": "هنوز توضیحی ثبت نشده است.",
    "No deadline": "بدون مهلت نهایی",
    "Board": "تابلو",
    "Milestones": "نقاط عطف",
    "Timeline": "زمان‌بندی",
    "Todo": "برای انجام",
    "In Progress": "در حال انجام",
    "Done": "انجام‌شده",
    "Add task": "افزودن وظیفه",
    "Add a task to your project board.": "وظیفه‌ای به تابلوی پروژه اضافه کنید.",
    "Description": "توضیحات",
    "Delete {title}": "حذف {title}",
    "Loading tasks...": "در حال بارگذاری وظایف...",
    "Unable to load tasks.": "بارگذاری وظایف ممکن نیست.",
    "Unable to create task.": "ایجاد وظیفه ممکن نیست.",
    "Unable to delete task.": "حذف وظیفه ممکن نیست.",
    "Loading project...": "در حال بارگذاری پروژه...",
    "Unable to load project.": "بارگذاری پروژه ممکن نیست.",
    "Close add task dialog": "بستن پنجره افزودن وظیفه",
    "Close create project dialog": "بستن پنجره ایجاد پروژه",
    "Unable to create project.": "ایجاد پروژه ممکن نیست.",
    "Project not found.": "پروژه پیدا نشد.",
    "High": "زیاد",
    "{title} progress": "پیشرفت {title}",
    "Oct 24, 2025": "۲۴ اکتبر ۲۰۲۵",
    "Nov 18, 2025": "۱۸ نوامبر ۲۰۲۵",
    "Dec 12, 2025": "۱۲ دسامبر ۲۰۲۵",
    "Oct 18": "۱۸ اکتبر",
    "Oct 20": "۲۰ اکتبر",
    "Oct 14": "۱۴ اکتبر",
    "Oct 16": "۱۶ اکتبر",
    "Oct 4": "۴ اکتبر",
    "Oct 6": "۶ اکتبر",
    "Oct 22": "۲۲ اکتبر",
    "Oct 28": "۲۸ اکتبر",
    "Oct 17": "۱۷ اکتبر",
    "Oct 8": "۸ اکتبر",
    "Nov 2": "۲ نوامبر",
    "Nov 8": "۸ نوامبر",
    "Oct 30": "۳۰ اکتبر",
    "18 days": "۱۸ روز",
    "25 days": "۲۵ روز",
    "49 days": "۴۹ روز",
    "10 tasks": "۱۰ وظیفه",
    "6 days": "۶ روز",
    "22 of 32 tasks": "۲۲ از ۳۲ وظیفه",
    "Task title": "عنوان وظیفه",
    "Category": "دسته‌بندی",
    "Priority": "اولویت",
    "Due date": "تاریخ سررسید",
    "Column": "ستون",
    "General": "عمومی",
    "No due date": "بدون تاریخ سررسید",
    "More options for {title}": "گزینه‌های بیشتر برای {title}",
    "Add task to {column}": "افزودن وظیفه به {column}",
    "Analyze Project with AI": "تحلیل پروژه با هوش مصنوعی",
    "Tasks": "وظایف",
    "{completed} of {total} done": "{completed} از {total} انجام‌شده",
    "Time remaining": "زمان باقی‌مانده",
    "E-commerce Platform": "پلتفرم تجارت الکترونیک",
    "A modern storefront with payments, inventory and customer accounts.": "فروشگاهی مدرن با پرداخت، مدیریت موجودی و حساب‌های کاربری.",
    "Build checkout flow": "ساخت فرایند پرداخت",
    "Payments": "پرداخت‌ها",
    "Add inventory alerts": "افزودن هشدارهای موجودی",
    "Core platform": "هسته پلتفرم",
    "Implement authentication": "پیاده‌سازی احراز هویت",
    "Foundation": "زیرساخت",
    "Design product catalog": "طراحی کاتالوگ محصولات",
    "Storefront": "فروشگاه آنلاین",
    "Set up project repository": "راه‌اندازی مخزن پروژه",
    "Define database schema": "تعریف ساختار پایگاه داده",
    "AI Learning Coach": "مربی یادگیری هوشمند",
    "Personalized AI study plans and adaptive learning recommendations.": "برنامه‌های مطالعه شخصی‌سازی‌شده و پیشنهادهای یادگیری تطبیقی با هوش مصنوعی.",
    "Design learning path": "طراحی مسیر یادگیری",
    "Learning engine": "موتور یادگیری",
    "Add progress tracking": "افزودن پیگیری پیشرفت",
    "Product": "محصول",
    "Review learning model": "بازبینی مدل یادگیری",
    "AI platform": "پلتفرم هوش مصنوعی",
    "Set up recommendation service": "راه‌اندازی سرویس پیشنهاددهی",
    "Personal Finance App": "اپلیکیشن مدیریت مالی شخصی",
    "Smart budgeting, spending insights and financial goal tracking.": "بودجه‌بندی هوشمند، تحلیل هزینه‌ها و پیگیری اهداف مالی.",
    "Build budget planner": "ساخت برنامه‌ریز بودجه",
    "Connect bank accounts": "اتصال حساب‌های بانکی",
    "Integrations": "یکپارچه‌سازی‌ها",
    "Define spending insights": "تعریف تحلیل هزینه‌ها",
    "Analytics": "تحلیل داده",
    "Create project repository": "ایجاد مخزن پروژه",
    "AI ANALYSIS": "تحلیل هوش مصنوعی",
    "Project health": "وضعیت سلامت پروژه",
    "AI-powered insights based on your current project activity.": "بینش‌های هوش مصنوعی بر اساس فعالیت فعلی پروژه شما.",
    "Run Analysis": "اجرای تحلیل",
    "Health score": "امتیاز سلامت",
    "Project Health: Medium Risk": "سلامت پروژه: ریسک متوسط",
    "Your project is making steady progress, but one critical dependency is putting the delivery timeline at risk.": "پروژه با روندی پایدار پیش می‌رود، اما یک وابستگی بحرانی زمان‌بندی تحویل را به خطر انداخته است.",
    "View project board": "مشاهده تابلوی پروژه",
    "Analyzed 2 min ago": "تحلیل‌شده در ۲ دقیقه پیش",
    "AI Insights": "بینش‌های هوش مصنوعی",
    "Prioritized recommendations to keep your project on track.": "پیشنهادهای اولویت‌بندی‌شده برای پیشبرد پروژه طبق برنامه.",
    "3 insights": "۳ بینش",
    "CRITICAL BOTTLENECK": "گلوگاه بحرانی",
    "Authentication is blocking 4 other tasks": "احراز هویت مانع انجام ۴ وظیفه دیگر شده است",
    "Checkout, user profiles, order history, and saved payments cannot begin until authentication is complete.": "تا تکمیل احراز هویت، پرداخت، پروفایل کاربران، تاریخچه سفارش‌ها و پرداخت‌های ذخیره‌شده قابل شروع نیستند.",
    "Complete authentication before starting checkout integration.": "پیش از شروع یکپارچه‌سازی پرداخت، احراز هویت را تکمیل کنید.",
    "SCHEDULE RISK": "ریسک زمان‌بندی",
    "Payments milestone may slip by 6 days": "نقطه عطف پرداخت ممکن است ۶ روز تأخیر داشته باشد",
    "The current task velocity suggests the payments milestone will miss its planned completion date.": "سرعت فعلی انجام کارها نشان می‌دهد نقطه عطف پرداخت به تاریخ تکمیل برنامه‌ریزی‌شده نمی‌رسد.",
    "Move one developer to the checkout flow this week.": "این هفته یک توسعه‌دهنده را به فرایند پرداخت اختصاص دهید.",
    "RECOMMENDED NEXT ACTION": "اقدام بعدی پیشنهادی",
    "Prioritize database integration": "یکپارچه‌سازی پایگاه داده را در اولویت قرار دهید",
    "Completing the database connection now unlocks the highest number of downstream tasks.": "تکمیل اتصال پایگاه داده بیشترین تعداد وظایف وابسته را فعال می‌کند.",
    "Schedule a focused 2-hour integration session.": "یک جلسه متمرکز دو ساعته برای یکپارچه‌سازی برنامه‌ریزی کنید.",
    "Remaining work": "کار باقی‌مانده",
    "{count} tasks": "{count} وظیفه",
    "Est. 46 hours": "حدود ۴۶ ساعت",
    "Deadline risk": "ریسک مهلت نهایی",
    "{days} days": "{days} روز",
    "Potential delay": "احتمال تأخیر",
    "Blocked tasks": "وظایف مسدودشده",
    "Critical tasks": "وظایف بحرانی",
    "RECOMMENDATION": "پیشنهاد",
    "Manage your workspace and AI planning preferences.": "فضای کاری و تنظیمات برنامه‌ریزی هوش مصنوعی را مدیریت کنید.",
    "Profile": "حساب کاربری",
    "Edit profile": "ویرایش حساب کاربری",
    "AI preferences": "تنظیمات هوش مصنوعی",
    "Choose how detailed your generated plans should be.": "میزان جزئیات برنامه‌های تولیدشده را انتخاب کنید.",
    "Planning detail": "میزان جزئیات برنامه‌ریزی",
    "Concise": "خلاصه",
    "Balanced": "متعادل",
    "Detailed": "با جزئیات",
  },
}

function formatTranslation(text: string, locale: Locale, values?: TranslationValues) {
  let result = translations[locale][text] ?? text

  if (!values) return result

  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{${key}}`, String(value))
  }

  return result
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const localeListeners = new Set<() => void>()

let currentLocale: Locale = "en"
if (typeof window !== "undefined") {
  try {
    const savedLocale = window.localStorage.getItem("planwise-locale")
    if (savedLocale === "fa" || savedLocale === "en") currentLocale = savedLocale
  } catch {
    // Locale switching still works when browser storage is unavailable.
  }
}

function getLocaleSnapshot() {
  return currentLocale
}

function getServerLocaleSnapshot(): Locale {
  return "en"
}

function subscribeToLocale(listener: () => void) {
  localeListeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== "planwise-locale") return
    if (event.newValue !== "fa" && event.newValue !== "en") return
    currentLocale = event.newValue
    localeListeners.forEach((notify) => notify())
  }

  window.addEventListener("storage", handleStorage)
  return () => {
    localeListeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr"
  }, [locale])

  const setLocale = useCallback((nextLocale: Locale) => {
    currentLocale = nextLocale
    try {
      window.localStorage.setItem("planwise-locale", nextLocale)
    } catch {
      // Keep the selection for this session if browser storage is unavailable.
    }
    localeListeners.forEach((notify) => notify())
  }, [])

  const t = useCallback<Translator>(
    (text, values) => formatTranslation(text, locale, values),
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error("useLocale must be used within LocaleProvider")
  return value
}
