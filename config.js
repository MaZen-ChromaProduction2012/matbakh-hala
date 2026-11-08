// ============================================================
// إعدادات منصة مطبخ حلويات حلا - Hala Sweets (المنيو المعتمد)
// ============================================================
window.HALA_CONFIG = {
  // بيانات التواصل
  storeName: "حلويات حلا • Hala Sweets",
  slogan: "حلا طعم يحلي حياتك — حلويات ومخبوزات بيتي بالدقيق العادي والحبة الكاملة",
  phone: "01285026373",
  whatsapp: "201285026373",
  facebookUrl: "https://www.facebook.com/MohamedElsagher0",
  
  // طرق الدفع المعتمدة
  payments: {
    instapay: {
      enabled: false,
      label: "انستاباي (InstaPay) - غير مفعل حالياً",
      address: "hala.sweets@instapay",
      phone: "01285026373"
    },
    wallet: {
      enabled: true,
      label: "محفظة إلكترونية (فودافون كاش)",
      number: "01285026373"
    },
    cod: {
      enabled: true,
      label: "الدفع نقداً عند الاستلام (كاش)"
    }
  },

  // رسوم التوصيل الافتراضية
  deliveryFee: 30,

  // الرقم السري الافتراضي للوحة التحكم (Admin PIN)
  adminPin: "1234",

  // مفتاح الذكاء الاصطناعي (Google Gemini API Key) لتحليلات المبيعات الذكية
  geminiApiKey: ""
};
