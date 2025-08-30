import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  category: string;
  price: number;
  originalPrice?: number;
  commission: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AffiliateStats {
  totalProducts: number;
  totalCommissions: number;
  averageCommission: number;
  topPerformingCategory: string;
  clicksToday: number;
  conversionsToday: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.url}/shop`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get product by ID
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.url}/shop/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create new product
  createProduct(product: Omit<Product, 'id'>): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.url}/shop`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update existing product
  updateProduct(id: string, product: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.url}/shop/${id}`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete product
  deleteProduct(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.url}/shop/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.url}/shop/category/${category}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Search products
  searchProducts(query: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.url}/shop/search?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get affiliate statistics
  getAffiliateStats(): Observable<ApiResponse<AffiliateStats>> {
    return this.http.get<ApiResponse<AffiliateStats>>(`${this.url}/shop/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Track affiliate click
  trackAffiliateClick(productId: string, userId?: string): Observable<ApiResponse<boolean>> {
    const payload = {
      productId,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    return this.http.post<ApiResponse<boolean>>(`${this.url}/shop/track-click`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get trending products
  getTrendingProducts(limit: number = 10): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.url}/shop/trending?limit=${limit}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get products with highest commission
  getHighCommissionProducts(limit: number = 10): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.url}/shop/high-commission?limit=${limit}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Bulk operations
  bulkUpdateProducts(updates: { id: string; updates: Partial<Product> }[]): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.url}/shop/bulk-update`, { updates })
      .pipe(
        catchError(this.handleError)
      );
  }

  bulkDeleteProducts(ids: string[]): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.url}/shop/bulk-delete`, { body: { ids } })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Import products from CSV/JSON
  importProducts(products: Omit<Product, 'id'>[]): Observable<ApiResponse<{ imported: number; failed: number }>> {
    return this.http.post<ApiResponse<{ imported: number; failed: number }>>(`${this.url}/shop/import`, { products })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Export products
  exportProducts(format: 'csv' | 'json' = 'json'): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.url}/shop/export?format=${format}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || `Server returned ${error.status}`;
    }
    
    console.error('ShopService error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Local storage fallback methods
  getLocalProducts(): Product[] {
    try {
      const data = localStorage.getItem('shopProducts');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  saveLocalProducts(products: Product[]): void {
    try {
      localStorage.setItem('shopProducts', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Utility methods
  calculateCommission(price: number, commissionRate: number): number {
    return (price * commissionRate) / 100;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  validateProduct(product: Partial<Product>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!product.title?.trim()) errors.push('Product title is required');
    if (!product.description?.trim()) errors.push('Product description is required');
    if (!product.imageUrl?.trim()) errors.push('Product image URL is required');
    if (!product.affiliateLink?.trim()) errors.push('Affiliate link is required');
    if (!product.category?.trim()) errors.push('Product category is required');
    if (product.price === undefined || product.price < 0) errors.push('Valid price is required');
    if (product.commission === undefined || product.commission < 0 || product.commission > 100) {
      errors.push('Commission must be between 0-100%');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
