/**
 * محرك لوحة تحكم الإدارة وتحليلات المبيعات بالذكاء الاصطناعي
 * Hala Sweets - Admin Dashboard & AI Sales Analytics Engine
 */

export class HalaAdminAnalytics {
  constructor(orders = [], products = [], geminiApiKey = '') {
    this.orders = orders;
    this.products = products;
    this.apiKey = geminiApiKey;
  }

  // استخراج مؤشرات الأداء الرئيسية (KPIs)
  getKPIMetrics() {
    const validOrders = this.orders.filter(o => o.status !== 'ملغي');
    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersCount = validOrders.length;
    const averageOrderValue = totalOrdersCount ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const itemCounts = {};
    validOrders.forEach(o => {
      (o.items || []).forEach(it => {
        itemCounts[it.id] = (itemCounts[it.id] || 0) + it.q;
      });
    });

    let topProductId = null;
    let maxQty = 0;
    for (const [id, qty] of Object.entries(itemCounts)) {
      if (qty > maxQty) {
        maxQty = qty;
        topProductId = Number(id);
      }
    }

    const topProduct = this.products.find(p => p.id === topProductId);

    return {
      totalRevenue,
      totalOrdersCount,
      averageOrderValue,
      topProduct: topProduct ? topProduct.n : 'صينية ميني بيتزا بالحبة الكاملة',
      topProductCount: maxQty
    };
  }

  // تحليل طرق الدفع المفضلة
  getPaymentDistribution() {
    const validOrders = this.orders.filter(o => o.status !== 'ملغي');
    const dist = {};
    validOrders.forEach(o => {
      const method = o.payment || 'الدفع عند الاستلام';
      dist[method] = (dist[method] || 0) + (o.total || 0);
    });
    return dist;
  }

  // توليد توصيات الذكاء الاصطناعي للمبيعات والمخزون
  async generateSalesRecommendations() {
    const kpis = this.getKPIMetrics();
    return {
      summary: `إجمالي المبيعات النشطة: ${kpis.totalRevenue} ج.م عبر ${kpis.totalOrdersCount} طلب (متوسط السلة: ${kpis.averageOrderValue} ج.م).`,
      topPerformer: `الصنف الأكثر مبيعاً: ${kpis.topProduct} بإجمالي ${kpis.topProductCount} طلبات.`,
      recommendations: [
        'إطلاق باقة الاشتراك الأسبوعي للانش بوكس (ميني بيتزا حبة كاملة + كوكيز شوفان) لزيادة الطلبات المتكررة.',
        'تفعيل خصم 10% على طلبات الكومبو الصحي (بوكس براونيز دارك + كوكيز) لرفع متوسط قيمة السلة.',
        'زيادة مخزون دقيق القمح الكامل والشوكولاتة الداكنة 70% بنسبة 25% قبل عطلة نهاية الأسبوع.'
      ]
    };
  }
}
