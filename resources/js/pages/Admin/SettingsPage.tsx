import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Global Constants ---
const BLUE_600 = '#2563EB';
const GREEN_600 = '#10B981';
const RED_600 = '#DC2626';
const PURPLE_600 = '#9333EA';

// --- Types ---
interface ListingCategory {
    id: number;
    name: string;
    price: number;
    sort_order: number;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

// --- Sub-Components ---
const ListingCategoryRow: React.FC<{ category: ListingCategory; onEdit: (category: ListingCategory) => void; onDelete: (id: number) => void }> = ({ category, onEdit, onDelete }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
        </td>
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-bold text-gray-900">LKR {category.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </td>
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{category.sort_order}</div>
        </td>
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
                onClick={() => onEdit(category)}
                className="text-blue-600 hover:text-blue-900 mr-4"
            >
                <i className="fas fa-edit mr-1"></i>Edit
            </button>
            <button
                onClick={() => onDelete(category.id)}
                className="text-red-600 hover:text-red-900"
            >
                <i className="fas fa-trash mr-1"></i>Delete
            </button>
        </td>
    </tr>
);

const CategoryRow: React.FC<{ category: Category; onEdit: (category: Category) => void; onDelete: (id: number) => void }> = ({ category, onEdit, onDelete }) => (
    <tr className="hover:bg-gray-50">
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
        </td>
        <td className="px-4 sm:px-6 py-4">
            <div className="text-sm text-gray-500">{category.description || 'No description'}</div>
        </td>
        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
                onClick={() => onEdit(category)}
                className="text-blue-600 hover:text-blue-900 mr-4"
            >
                <i className="fas fa-edit mr-1"></i>Edit
            </button>
            <button
                onClick={() => onDelete(category.id)}
                className="text-red-600 hover:text-red-900"
            >
                <i className="fas fa-trash mr-1"></i>Delete
            </button>
        </td>
    </tr>
);

const CategoryModal: React.FC<{ category: Category | null; onClose: () => void; onSave: (category: Category) => void; isEditing: boolean }> = ({ category, onClose, onSave, isEditing }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
        setErrors({});
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { name?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            id: category?.id || 0,
            name: name.trim(),
            description: description.trim(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="category-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="e.g., Real Estate"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description (Optional)
                            </label>
                            <textarea
                                id="category-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of the category"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: GREEN_600 }}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ListingCategoryModal: React.FC<{ category: ListingCategory | null; onClose: () => void; onSave: (category: ListingCategory) => void; isEditing: boolean }> = ({ category, onClose, onSave, isEditing }) => {
    const [name, setName] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [sortOrder, setSortOrder] = useState('0');
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

    useEffect(() => {
        if (category) {
            setName(category.name);
            setPriceValue(category.price.toString());
            setSortOrder(category.sort_order.toString());
        } else {
            setName('');
            setPriceValue('');
            setSortOrder('0');
        }
        setErrors({});
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { name?: string; price?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!priceValue || parseFloat(priceValue) < 0) {
            newErrors.price = 'Valid price is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            id: category?.id || 0,
            name: name.trim(),
            price: parseFloat(priceValue),
            sort_order: parseInt(sortOrder) || 0,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Listing Category' : 'Add New Listing Category'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="category-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="e.g., VIP, Super, NAR"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="category-price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price (LKR)
                            </label>
                            <input
                                type="number"
                                id="category-price"
                                step="0.01"
                                min="0"
                                value={priceValue}
                                onChange={(e) => setPriceValue(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.price ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>

                        <div>
                            <label htmlFor="category-sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                id="category-sort-order"
                                min="0"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                            />
                            <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors"
                            style={{ backgroundColor: BLUE_600 }}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const [listingCategories, setListingCategories] = useState<ListingCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingListingCategory, setEditingListingCategory] = useState<ListingCategory | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showAddListingCategoryModal, setShowAddListingCategoryModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load listing categories from API
    const loadListingCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/admin/api/settings/listing-categories');
            if (response.data.success) {
                setListingCategories(response.data.categories);
            } else {
                setError('Failed to load listing categories.');
            }
        } catch (err: any) {
            console.error('Load listing categories error:', err);
            setError(err?.response?.data?.message || 'Failed to load listing categories. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load categories from API
    const loadCategories = useCallback(async () => {
        setCategoriesLoading(true);
        setError(null);
        try {
            const response = await axios.get('/admin/api/settings/categories');
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                setError('Failed to load categories.');
            }
        } catch (err: any) {
            console.error('Load categories error:', err);
            setError(err?.response?.data?.message || 'Failed to load categories. Please try again.');
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    useEffect(() => {
        loadListingCategories();
        loadCategories();
    }, [loadListingCategories, loadCategories]);

    // Handle listing category save (create or update)
    const handleListingCategorySave = async (categoryData: ListingCategory) => {
        setSaving(true);
        setError(null);
        try {
            if (categoryData.id && editingListingCategory) {
                // Update existing
                const response = await axios.put(`/admin/api/settings/listing-categories/${categoryData.id}`, {
                    name: categoryData.name,
                    price: categoryData.price,
                    sort_order: categoryData.sort_order,
                });
                if (response.data.success) {
                    setListingCategories(prev => prev.map(c => c.id === categoryData.id ? response.data.category : c));
                    setEditingListingCategory(null);
                    alert('Listing category updated successfully!');
                } else {
                    setError('Failed to update listing category.');
                }
            } else {
                // Create new
                const response = await axios.post('/admin/api/settings/listing-categories', {
                    name: categoryData.name,
                    price: categoryData.price,
                    sort_order: categoryData.sort_order,
                });
                if (response.data.success) {
                    setListingCategories(prev => [response.data.category, ...prev].sort((a, b) => a.sort_order - b.sort_order));
                    setShowAddListingCategoryModal(false);
                    alert('Listing category created successfully!');
                } else {
                    setError('Failed to create listing category.');
                }
            }
        } catch (err: any) {
            console.error('Save listing category error:', err);
            const errorMessage = err?.response?.data?.message || err?.response?.data?.errors 
                ? JSON.stringify(err.response.data.errors || err.response.data.message)
                : 'Failed to save listing category. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Handle listing category delete
    const handleListingCategoryDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this listing category?')) {
            return;
        }

        try {
            const response = await axios.delete(`/admin/api/settings/listing-categories/${id}`);
            if (response.data.success) {
                setListingCategories(prev => prev.filter(c => c.id !== id));
                alert('Listing category deleted successfully!');
            } else {
                setError('Failed to delete listing category.');
            }
        } catch (err: any) {
            console.error('Delete listing category error:', err);
            alert(err?.response?.data?.message || 'Failed to delete listing category. Please try again.');
        }
    };

    // Handle category save (create or update)
    const handleCategorySave = async (categoryData: Category) => {
        setSaving(true);
        setError(null);
        try {
            if (categoryData.id && editingCategory) {
                // Update existing
                const response = await axios.put(`/admin/api/settings/categories/${categoryData.id}`, {
                    name: categoryData.name,
                    description: categoryData.description,
                });
                if (response.data.success) {
                    setCategories(prev => prev.map(c => c.id === categoryData.id ? response.data.category : c));
                    setEditingCategory(null);
                    alert('Category updated successfully!');
                } else {
                    setError('Failed to update category.');
                }
            } else {
                // Create new
                const response = await axios.post('/admin/api/settings/categories', {
                    name: categoryData.name,
                    description: categoryData.description,
                });
                if (response.data.success) {
                    setCategories(prev => [response.data.category, ...prev]);
                    setShowAddCategoryModal(false);
                    alert('Category created successfully!');
                } else {
                    setError('Failed to create category.');
                }
            }
        } catch (err: any) {
            console.error('Save category error:', err);
            const errorMessage = err?.response?.data?.message || err?.response?.data?.errors 
                ? JSON.stringify(err.response.data.errors || err.response.data.message)
                : 'Failed to save category. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Handle category delete
    const handleCategoryDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            const response = await axios.delete(`/admin/api/settings/categories/${id}`);
            if (response.data.success) {
                setCategories(prev => prev.filter(c => c.id !== id));
                alert('Category deleted successfully!');
            } else {
                setError('Failed to delete category.');
            }
        } catch (err: any) {
            console.error('Delete category error:', err);
            alert(err?.response?.data?.message || 'Failed to delete category. Please try again.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                            <p className="text-gray-600 mt-1">Manage listing categories and system configurations</p>
                        </div>
                        <button
                            onClick={() => setShowAddListingCategoryModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <i className="fas fa-plus mr-2"></i>Add New Listing Category
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Listing Categories Management Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="bg-purple-50 px-4 sm:px-6 py-4 border-b border-purple-200">
                        <h2 className="text-lg sm:text-xl font-semibold text-purple-900">Listing Categories</h2>
                        <p className="text-sm text-purple-700 mt-1">Manage listing categories and their pricing</p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading listing categories...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category Name
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sort Order
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {listingCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                                                No listing categories found. Click "Add New Listing Category" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        listingCategories.map(category => (
                                            <ListingCategoryRow
                                                key={category.id}
                                                category={category}
                                                onEdit={setEditingListingCategory}
                                                onDelete={handleListingCategoryDelete}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Category Management Section */}
                <div className="bg-white rounded-lg shadow-sm mt-6 sm:mt-8">
                    <div className="bg-green-50 px-4 sm:px-6 py-4 border-b border-green-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-green-900">Category Management</h2>
                            <p className="text-sm text-green-700 mt-1">Manage common categories for advertisements</p>
                        </div>
                        <button
                            onClick={() => setShowAddCategoryModal(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            <i className="fas fa-plus mr-2"></i>Add New Category
                        </button>
                    </div>

                    {categoriesLoading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="mt-4 text-gray-600">Loading categories...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category Name
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                                                No categories found. Click "Add New Category" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map(category => (
                                            <CategoryRow
                                                key={category.id}
                                                category={category}
                                                onEdit={setEditingCategory}
                                                onDelete={handleCategoryDelete}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Listing Category Modal */}
            {(showAddListingCategoryModal || editingListingCategory) && (
                <ListingCategoryModal
                    category={editingListingCategory}
                    onClose={() => {
                        setShowAddListingCategoryModal(false);
                        setEditingListingCategory(null);
                    }}
                    onSave={handleListingCategorySave}
                    isEditing={!!editingListingCategory}
                />
            )}

            {/* Add/Edit Category Modal */}
            {(showAddCategoryModal || editingCategory) && (
                <CategoryModal
                    category={editingCategory}
                    onClose={() => {
                        setShowAddCategoryModal(false);
                        setEditingCategory(null);
                    }}
                    onSave={handleCategorySave}
                    isEditing={!!editingCategory}
                />
            )}
        </div>
    );
};

export default SettingsPage;

