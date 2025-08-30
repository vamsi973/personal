import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
    selector: 'app-product-manage',
    templateUrl: './product-manage.component.html',
    styleUrls: ['./product-manage.component.css'],
    standalone: false,
})

export class ProductManageComponent implements OnInit {
    products: Product[] = [];
    product: Product = this.getEmptyProduct();
    editMode = false;
    editIndex: number | null = null;
    loading: boolean = false;
    showForm: boolean = false;
    searchTerm: string = '';
    selectedCategory: string = '';
    categories: string[] = ['Electronics', 'Wearables', 'Home & Office', 'Fashion', 'Books', 'Sports', 'Beauty', 'Other'];

    constructor(
        private shop: ShopService
    ) { }

    ngOnInit() {
        this.loadProducts();
    }

    getEmptyProduct(): Product {
        return {
            id: this.generateId(),
            title: '',
            description: '',
            imageUrl: '',
            affiliateLink: '',
            category: '',
            price: 0,
            originalPrice: undefined,
            commission: 10,
            rating: 0,
            reviewCount: 0,
            inStock: true,
            tags: []
        };
    }

    generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadProducts() {
        this.loading = true;
        const data = localStorage.getItem('shopProducts');
        this.products = data ? JSON.parse(data) : this.getSampleProducts();
        this.loading = false;
    }

    saveProducts() {
        localStorage.setItem('shopProducts', JSON.stringify(this.products));
    }

    onSubmit() {
        if (!this.validateProduct()) {
            return;
        }

        if (this.editMode && this.editIndex !== null) {
            this.products[this.editIndex] = { ...this.product };
        } else {
            this.products.push({ ...this.product });
        }
        
        // this.saveProducts();
        
        
        // API call
        this.shop.createProduct(this.product).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.showNotification('Product saved successfully!', 'success');
                    this.loadProducts();
                    this.resetForm();
                } else {
                    this.showNotification('Failed to save product', 'error');
                }
            },
            error: (error) => {
                console.error('Error saving product:', error);
                this.showNotification('Error saving product', 'error');
            }
        });
    }

    validateProduct(): boolean {
        if (!this.product.title.trim()) {
            this.showNotification('Product title is required', 'error');
            return false;
        }
        if (!this.product.description.trim()) {
            this.showNotification('Product description is required', 'error');
            return false;
        }
        if (!this.product.imageUrl.trim()) {
            this.showNotification('Product image URL is required', 'error');
            return false;
        }
        if (!this.product.affiliateLink.trim()) {
            this.showNotification('Affiliate link is required', 'error');
            return false;
        }
        if (!this.product.category) {
            this.showNotification('Product category is required', 'error');
            return false;
        }
        if (this.product.price === undefined || this.product.price < 0) {
            this.showNotification('Valid price is required', 'error');
            return false;
        }
        if (this.product.commission < 0 || this.product.commission > 100) {
            this.showNotification('Commission must be between 0-100%', 'error');
            return false;
        }
        return true;
    }

    editProduct(index: number) {
        this.product = { ...this.products[index] };
        this.editMode = true;
        this.editIndex = index;
        this.showForm = true;
    }

    deleteProduct(index: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products.splice(index, 1);
            this.saveProducts();
            if (this.editIndex === index) {
                this.resetForm();
            }
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    resetForm() {
        this.product = this.getEmptyProduct();
        this.editMode = false;
        this.editIndex = null;
        this.showForm = false;
    }

    toggleForm() {
        this.showForm = !this.showForm;
        if (!this.showForm) {
            this.resetForm();
        }
    }

    addTag(tag: string) {
        if (tag.trim() && !this.product.tags.includes(tag.trim())) {
            this.product.tags.push(tag.trim());
        }
    }

    removeTag(tag: string) {
        this.product.tags = this.product.tags.filter(t => t !== tag);
    }

    getFilteredProducts(): Product[] {
        let filtered = this.products;
        
        if (this.searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.category === this.selectedCategory);
        }
        
        return filtered;
    }

    getSampleProducts(): Product[] {
        return [
            {
                id: '1',
                title: 'Wireless Noise-Cancelling Headphones',
                description: 'Premium wireless headphones with active noise cancellation.',
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
            }
        ];
    }

    showNotification(message: string, type: 'success' | 'error') {
        // Simple notification - you can enhance this with a proper notification service
        alert(message);
    }

    duplicateProduct(product: Product) {
        const duplicated = { ...product, id: this.generateId(), title: `${product.title} (Copy)` };
        this.products.push(duplicated);
        this.saveProducts();
        this.showNotification('Product duplicated successfully!', 'success');
    }

    toggleStock(product: Product) {
        product.inStock = !product.inStock;
        this.saveProducts();
        this.showNotification(`Product ${product.inStock ? 'marked as in stock' : 'marked as out of stock'}`, 'success');
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
