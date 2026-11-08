/**
 * محرك الذكاء الاصطناعي لحساب السعرات وبوابة الدفع لمنصة حلويات حلا (المنيو الرسمي 37 صنفاً)
 * Hala Sweets - Calorie Calculator Bot & Payment Processing Engine
 */

class HalaCalorieBot {
  constructor(menuItems, apiKey = '') {
    this.menu = menuItems;
    this.apiKey = apiKey;
  }

  calculateMealCalories(selectedItems) {
    let totalCalories = 0;
    const breakdown = [];

    selectedItems.forEach(item => {
      const product = this.menu.find(p => p.id === item.id);
      if (product) {
        const itemCal = product.cal * item.quantity;
        totalCalories += itemCal;
        breakdown.push({
          name: product.n || product.name,
          quantity: item.quantity,
          caloriesPerUnit: product.cal,
          totalItemCalories: itemCal
        });
      }
    });

    return { totalCalories, breakdown };
  }

  answerInquiry(question) {
    const q = question.toLowerCase();

    if (q.includes('كب كيك') || q.includes('كبكيك')) {
      return 'أسعار قسم الكب كيك:\n' +
        '• بوكس 5 قطع سادة (دقيق عادي): 80 ج.م\n' +
        '• بوكس 5 قطع بصوص من اختيارك (دقيق عادي): 100 ج.م\n' +
        '• بوكس 5 قطع سادة (حبة كاملة): 100 ج.م\n' +
        '• بوكس 5 قطع بصوص من اختيارك (حبة كاملة): 120 ج.م\n' +
        '• قطعة كب كيك سادة: 20 ج.م | بصوص من اختيارك: 25 ج.م';
    }

    if (q.includes('براونيز') || q.includes('كوكيز') || q.includes('امريكان')) {
      return 'أسعار البراونيز والأمريكان كوكيز:\n' +
        '• بوكس 6 براونيز سادة: 120 ج.م | بصوص من اختيارك: 150 ج.م | قطعة بصوص: 30 ج.م\n' +
        '• بوكس 6 كوكيز شوكولاتة: 120 ج.م | بصوص من اختيارك: 150 ج.م | قطعة أمريكان كوكيز كبيرة: 30 ج.م';
    }

    if (q.includes('كب السعادة') || q.includes('سعادة') || q.includes('قشطوط')) {
      return 'أسعار كب السعادة والقشطوطة (كل الأنواع 40 ج.م):\n' +
        '• كب السعادة (40 ج.م): أوريو، شوكولاتة، كيندر، نوتيلا، كاسترد، كراميل.\n' +
        '• قشطوطة (40 ج.م): سادة، فراولة، مانجو، شوكولاتة، كراميل.';
    }

    if (q.includes('مخبوزات') || q.includes('قراقيش') || q.includes('بيتزا') || q.includes('باتي') || q.includes('انجلش') || q.includes('إنجلش')) {
      return 'أسعار المخبوزات (نصف كيلو) والإنجلش كيك (14 قطعة):\n' +
        '• نصف كيلو قراقيش (دقيق عادي): سادة 100 ج.م | عجوة 130 ج.م\n' +
        '• نصف كيلو قراقيش (حبة كاملة): سادة 120 ج.م | عجوة 150 ج.م\n' +
        '• نصف كيلو بيتزا أو باتيه: عادية 120 ج.م | حبة كاملة 150 ج.م\n' +
        '• نصف كيلو مخبوزات مشكلة: عادية 150 ج.م | حبة كاملة 200 ج.م\n' +
        '• قالب إنجلش كيك (14 قطعة): فانيليا 120 ج.م | برتقال 130 ج.م | شوكولاتة 140 ج.م | شوكولاتة وفانيليا (حبة كاملة) 150 ج.م';
    }

    if (q.includes('سعر') || q.includes('اسعار') || q.includes('بكام') || q.includes('منيو')) {
      return 'منيو مطبخ حلويات حلا الرسمي يضم 37 صنفاً في 7 أقسام:\n' +
        '1. كب كيك: القطعة 20–25 ج.م | البوكس (5 قطع) 80–120 ج.م\n' +
        '2. البراونيز: بوكس 6 قطع سادة 120 ج.م | بصوص 150 ج.م | القطعة 30 ج.م\n' +
        '3. أمريكان كوكيز: بوكس 6 قطع 120 ج.م | بصوص 150 ج.م | القطعة الكبيرة 30 ج.م\n' +
        '4. كب السعادة (أوريو/شوكولاتة/كيندر/نوتيلا/كاسترد/كراميل): 40 ج.م\n' +
        '5. المخبوزات (نصف كيلو قراقيش/بيتزا/باتيه/مشكل - عادي وحبة كاملة): 100–200 ج.م\n' +
        '6. إنجلش كيك (قالب 14 قطعة - فانيليا/برتقال/شوكولاتة/حبة كاملة): 120–150 ج.م\n' +
        '7. قشطوطة (سادة/فراولة/مانجو/شوكولاتة/كراميل): 40 ج.م';
    }

    if (q.includes('دفع') || q.includes('كاش') || q.includes('محفظة') || q.includes('فودافون')) {
      return 'طرق الدفع المتاحة في مطبخ حلا:\n' +
        '1. محفظة فودافون كاش على رقم 01285026373\n' +
        '2. الدفع نقداً عند الاستلام (كاش) مع مندوب التوصيل';
    }

    return 'أهلاً بك في مطبخ حلويات حلا! نقدم 37 صنفاً من الحلويات والمخبوزات البيتي الطازجة بالدقيق العادي ودقيق الحبة الكاملة. كيف أقدر أساعدك اليوم؟';
  }
}

class HalaPaymentProcessor {
  constructor(config) {
    this.config = config;
  }

  processPaymentSelection(method, orderDetails) {
    switch(method) {
      case 'wallet':
        return {
          status: 'pending_wallet',
          instructions: `يرجى تحويل المبلغ (${orderDetails.total} ج.م) إلى محفظة فودافون كاش على الرقم: ${this.config.payments.wallet.number}، وسيتم تأكيد الطلب فور وصول الإشعار.`
        };
      case 'cod':
      default:
        return {
          status: 'cash_on_delivery',
          instructions: `تم تسجيل طلبك بالدفع نقداً عند الاستلام (${orderDetails.total} ج.م). سيتم تجهيز طلبك طازجاً وتوصيله لعنوانك.`
        };
    }
  }
}
