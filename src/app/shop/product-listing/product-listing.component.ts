import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
    selector: 'app-product-listing',
    templateUrl: './product-listing.component.html',
    standalone: false,
    styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {
    constructor(
        private shop: ShopService
    ) { }

    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: string[] = [];
    searchTerm: string = '';
    selectedCategory: string = '';
    priceRange: { min: number; max: number } = { min: 0, max: 10000 };
    sortBy: string = 'relevance';
    loading: boolean = false;

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading = true;
        this.shop.getProducts().subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.products = res.data;
                } else {
                    // Fallback to sample data if API fails
                    this.products = this.getSampleProducts();
                }
                this.filteredProducts = [...this.products];
                this.extractCategories();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.products = this.getSampleProducts();
                this.filteredProducts = [...this.products];
                this.extractCategories();
                this.loading = false;
            }
        });
    }

    getSampleProducts(): Product[] {
        return []
        return [
            {
                id: '1',
                title: 'Wireless Noise-Cancelling Headphones',
                description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                affiliateLink: 'https://affiliate.example.com/headphones?tid=123',
                category: 'Electronics',
                price: 2999,
                originalPrice: 3999,
                commission: 15,
                rating: 4.8,
                reviewCount: 1247,
                inStock: true,
                tags: ['Wireless', 'Noise Cancelling', 'Premium']
            },
            {
                id: '2',
                title: 'Smart Fitness Watch',
                description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.',
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                affiliateLink: 'https://affiliate.example.com/smartwatch?tid=123',
                category: 'Wearables',
                price: 4999,
                originalPrice: 5999,
                commission: 12,
                rating: 4.6,
                reviewCount: 892,
                inStock: true,
                tags: ['Fitness', 'GPS', 'Heart Rate']
            },
            {
                id: '3',
                title: 'Portable Bluetooth Speaker',
                description: 'Waterproof portable speaker with 360° sound and 20-hour battery life.',
                imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
                affiliateLink: 'https://affiliate.example.com/speaker?tid=123',
                category: 'Electronics',
                price: 1499,
                originalPrice: 1999,
                commission: 18,
                rating: 4.4,
                reviewCount: 567,
                inStock: false,
                tags: ['Portable', 'Waterproof', 'Bluetooth']
            },
            {
                id: '4',
                title: 'Ergonomic Office Chair',
                description: 'Premium ergonomic chair with lumbar support and adjustable features for long work hours.',
                imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
                affiliateLink: 'https://affiliate.example.com/chair?tid=123',
                category: 'Home & Office',
                price: 8999,
                originalPrice: 12999,
                commission: 20,
                rating: 4.9,
                reviewCount: 234,
                inStock: true,
                tags: ['Ergonomic', 'Adjustable', 'Premium']
            }
        ];
    }

    extractCategories() {
        this.categories = [...new Set(this.products.map(p => p.category))];
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                product.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
            
            const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
            
            const matchesPrice = product.price >= this.priceRange.min && product.price <= this.priceRange.max;
            
            return matchesSearch && matchesCategory && matchesPrice;
        });

        this.sortProducts();
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'commission':
                this.filteredProducts.sort((a, b) => b.commission - a.commission);
                break;
            default:
                // Relevance - keep original order
                break;
        }
    }

    onSearchChange() {
        this.filterProducts();
    }

    onCategoryChange() {
        this.filterProducts();
    }

    onSortChange() {
        this.sortProducts();
    }

    onPriceRangeChange() {
        this.filterProducts();
    }

    getDiscountPercentage(originalPrice: number, currentPrice: number): number {
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    trackAffiliateClick(product: Product) {
        // Track affiliate clicks for analytics
        console.log(`Affiliate link clicked for: ${product.title}`);
        // You can implement analytics tracking here
    }

    showProductDetails(product: Product) {
        // You can implement a modal or navigation to detailed view
        console.log('Showing details for:', product.title);
        // TODO: Implement product details modal or navigation
    }

    getProducts() {
        this.loadProducts();
    }
}

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
