import { Component, OnInit } from '@angular/core';
import { ShopService, AffiliateStats } from '../../services/shop.service';

@Component({
  selector: 'app-affiliate-dashboard',
  templateUrl: './affiliate-dashboard.component.html',
  styleUrls: ['./affiliate-dashboard.component.css']
})
export class AffiliateDashboardComponent implements OnInit {
  stats: AffiliateStats | null = null;
  loading = false;
  error: string | null = null;
  
  // Chart data for visualizations
  commissionChartData: any[] = [];
  categoryChartData: any[] = [];
  performanceChartData: any[] = [];

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.loadAffiliateStats();
  }

  loadAffiliateStats() {
    this.loading = true;
    this.error = null;

    this.shopService.getAffiliateStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
          this.prepareChartData();
        } else {
          this.error = response.message || 'Failed to load statistics';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading affiliate statistics';
        this.loading = false;
        console.error('Error loading stats:', error);
      }
    });
  }

  prepareChartData() {
    if (!this.stats) return;

    // Mock chart data - you can integrate with Chart.js or other charting libraries
    this.commissionChartData = [
      { month: 'Jan', commission: 15000 },
      { month: 'Feb', commission: 18000 },
      { month: 'Mar', commission: 22000 },
      { month: 'Apr', commission: 19000 },
      { month: 'May', commission: 25000 },
      { month: 'Jun', commission: 28000 }
    ];

    this.categoryChartData = [
      { category: 'Electronics', products: 45, commission: 35 },
      { category: 'Fashion', products: 32, commission: 25 },
      { category: 'Home & Office', products: 28, commission: 20 },
      { category: 'Sports', products: 20, commission: 15 },
      { category: 'Books', products: 15, commission: 5 }
    ];

    this.performanceChartData = [
      { day: 'Mon', clicks: 120, conversions: 8 },
      { day: 'Tue', clicks: 145, conversions: 12 },
      { day: 'Wed', clicks: 98, conversions: 6 },
      { day: 'Thu', clicks: 167, conversions: 15 },
      { day: 'Fri', clicks: 134, conversions: 11 },
      { day: 'Sat', clicks: 89, conversions: 7 },
      { day: 'Sun', clicks: 76, conversions: 5 }
    ];
  }

  getConversionRate(): number {
    if (!this.stats || this.stats.clicksToday === 0) return 0;
    return (this.stats.conversionsToday / this.stats.clicksToday) * 100;
  }

  getTotalEarnings(): number {
    if (!this.stats) return 0;
    return this.stats.totalCommissions;
  }

  getAverageCommission(): number {
    if (!this.stats) return 0;
    return this.stats.averageCommission;
  }

  refreshStats() {
    this.loadAffiliateStats();
  }

  exportReport() {
    // Implement export functionality
    console.log('Exporting affiliate report...');
  }
}
