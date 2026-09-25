import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import Select from 'react-select';
import ImageEditorModal from '../../components/ImageEditorModal';

const PINK = '#EC4899';
const LIGHT_BLUE = '#60A5FA';

const LOCATION_OPTIONS = [
    { value: 'Colombo', label: 'Colombo' },
    { value: 'Gampaha', label: 'Gampaha' },
    { value: 'Kandy', label: 'Kandy' },
    { value: 'Galle', label: 'Galle' },
    { value: 'Kurunegala', label: 'Kurunegala' },
    { value: 'Nugegoda', label: 'Nugegoda' },
    { value: 'Maharagama', label: 'Maharagama' },
    { value: 'Dehiwala', label: 'Dehiwala' },
    { value: 'Mount Lavinia', label: 'Mount Lavinia' },
    { value: 'Negombo', label: 'Negombo' },
    { value: 'Malabe', label: 'Malabe' },
    { value: 'Battaramulla', label: 'Battaramulla' },
];

interface ProgressStep {
    id: number;
    title: string;
    description: string;
}

const STEP_DATA: ProgressStep[] = [
    { id: 1, title: 'Category & Location', description: 'Select the category and location for this ad' },
    { id: 2, title: 'Details & Price', description: 'Add title, description, and pricing information' },
    { id: 3, title: 'Media Upload', description: 'Add photos and videos to showcase your listing' },
];

type Option = { id: number; name: string; price?: string | number | null };

type PostNewAdProps = {
    commonCategories: Option[];
    listingCategories: Option[];
    subCategories: Option[];
    ad?: any;
    isEditing?: boolean;
};

type PostNewAdForm = {
    title: string;
    description: string;
    price: string;
    location: string;
    phone_number: string;
    whatsapp_number: string;
    telegram_number: string;
    common_category_id: string;
    listing_category_id: string;
    sub_category_id: string;
    images: File[];
};

const StepIndicator: React.FC<{ step: ProgressStep; currentStep: number }> = ({ step, currentStep }) => {
    const isCurrent = step.id === currentStep;
    const isCompleted = step.id < currentStep;

    const circleClass = isCurrent
        ? 'bg-pink-500 text-white'
        : isCompleted
            ? 'bg-blue-400 text-white'
            : 'bg-gray-300 text-gray-600';

    const textClass = isCurrent
        ? 'text-pink-500'
        : isCompleted
            ? 'text-blue-500'
            : 'text-gray-600';

    return (
        <div className="flex items-center transition-colors duration-300">
            <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${circleClass}`}
                style={{ backgroundColor: isCurrent ? PINK : isCompleted ? LIGHT_BLUE : undefined }}
            >
                {isCompleted ? '✓' : step.id}
            </div>
            <span
                className={`ml-2 text-sm sm:text-base font-medium ${textClass}`}
                style={{ color: isCurrent ? PINK : isCompleted ? LIGHT_BLUE : undefined }}
            >
                {step.title}
            </span>
        </div>
    );
};

const PostNewAd: React.FC<PostNewAdProps> = ({ commonCategories, listingCategories, subCategories, ad, isEditing = false }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        clearErrors,
    } = useForm<PostNewAdForm>({
        title: ad?.title || '',
        description: ad?.description || '',
        price: ad?.price ? String(ad.price) : '',
        location: ad?.location || '',
        phone_number: ad?.phone_number || '',
        whatsapp_number: ad?.whatsapp_number || '',
        telegram_number: ad?.telegram_number || '',
        common_category_id: ad?.common_category_id ? String(ad.common_category_id) : '',
        listing_category_id: ad?.listing_category_id ? String(ad.listing_category_id) : '',
        sub_category_id: ad?.sub_category_id ? String(ad.sub_category_id) : '',
        images: [],
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    // Initialize existing images preview from ad data
    const [existingImages, setExistingImages] = useState<string[]>(ad?.formatted_images || []);

    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

    const handleImageEdited = (editedFile: File) => {
        if (editingImageIndex === null) return;
        
        const currentImages = data.images as File[];
        const newImages = [...currentImages];
        newImages[editingImageIndex] = editedFile;
        setData('images', newImages);
        
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[editingImageIndex]);
            newUrls[editingImageIndex] = URL.createObjectURL(editedFile);
            return newUrls;
        });
        
        setEditingImageIndex(null);
    };


    const imageInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const listingOptions = useMemo(
        () => [{ id: 0, name: 'No Special Listing' }, ...listingCategories],
        [listingCategories],
    );

    const subOptions = useMemo(
        () => [{ id: 0, name: 'None' }, ...subCategories],
        [subCategories],
    );

    
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const handleDiscard = () => {
        setShowDiscardModal(true);
    };

    const confirmDiscard = () => {
        reset();
        localStorage.removeItem('post_ad_draft');
        setCurrentStep(1);
        setPreviewUrls([]);
        setExistingImages([]);
        setShowDiscardModal(false);
    };

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('post_ad_draft');
        if (savedDraft && !isEditing) {
            try {
                const parsed = JSON.parse(savedDraft);
                Object.keys(parsed).forEach(key => {
                    if (key !== 'images') {
                        setData(key as any, parsed[key]);
                    }
                });
            } catch (e) {}
        }
    }, []);

    // Save draft on data change
    useEffect(() => {
        if (!isEditing) {
            const dataToSave = { ...data };
            delete dataToSave.images;
            localStorage.setItem('post_ad_draft', JSON.stringify(dataToSave));
        }
    }, [data.title, data.description, data.price, data.location, data.phone_number, data.whatsapp_number, data.common_category_id, data.listing_category_id, data.sub_category_id]);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // If creating new ad, images are required.
        // If editing, images are optional (if we have existing ones). 
        // Logic: if not editing, OR (editing AND no existing images AND no new images), then error.
        // Actually simpler: if images array is empty AND (not editing OR (editing and no existing images)), show error.

        if (data.images.length === 0 && (!isEditing || (isEditing && existingImages.length === 0))) {
            setError('images', 'Please upload at least one image.');
            return;
        }

        const submitOptions = {
            forceFormData: true,
            onSuccess: () => {
                localStorage.removeItem('post_ad_draft');
                if (!isEditing) {
                    setCurrentStep(1);
                    reset();
                    setPreviewUrls((previous) => {
                        previous.forEach((url) => URL.revokeObjectURL(url));
                        return [];
                    });
                    if (imageInputRef.current) {
                        imageInputRef.current.value = '';
                    }
                }
            },
            onError: (errors: any) => { // Added type 'any' to avoid strict check
                const step1Fields = ['common_category_id', 'sub_category_id', 'location', 'phone_number', 'whatsapp_number', 'telegram_number'];
                const step2Fields = ['title', 'description', 'price', 'listing_category_id'];

                const hasStep1Error = Object.keys(errors).some(key => step1Fields.includes(key));
                const hasStep2Error = Object.keys(errors).some(key => step2Fields.includes(key));
                const hasStep3Error = Object.keys(errors).some(key => key.startsWith('images'));

                if (hasStep1Error) {
                    setCurrentStep(1);
                } else if (hasStep2Error) {
                    setCurrentStep(2);
                } else if (hasStep3Error) {
                    setCurrentStep(3);
                }
            }
        };

        if (isEditing && ad) {
            // For Inertia file uploads with PUT, we generally use POST with _method: 'PUT' or just router.post
            router.post(`/agent/ads/${ad.id}/update`, {
                _method: 'post', // Just using post as defined in routes
                ...data,
            } as any, submitOptions); // Casting to any to avoid strict type checks on Inertia call if needed
        } else {
            post('/agent/post', submitOptions);
        }
    };

    const maxImages = useMemo(() => {
        if (!data.listing_category_id) return 1;
        const selectedCat = listingCategories.find(c => String(c.id) === String(data.listing_category_id));
        if (!selectedCat || !selectedCat.price) return 1;
        const price = Number(selectedCat.price);
        if (price >= 700) return 5;
        if (price >= 500) return 3;
        return 1;
    }, [data.listing_category_id, listingCategories]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files).slice(0, maxImages);
        setData('images', newFiles);
        clearErrors('images');

        // If user selects new files, clears existing images preview?
        // Let's adopt the strategy: if new files selected, we replace everything.
        // So we should hide existing images when new ones are picked.
        setExistingImages([]);

        setPreviewUrls((previous) => {
            previous.forEach((url) => URL.revokeObjectURL(url));
            return newFiles.map((file) => URL.createObjectURL(file));
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div id="step1" className="space-y-6">
                        <div className="border-b pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Step 1: Category &amp; Location</h2>
                            <p className="text-gray-600 mt-1">Select the category and location for this ad</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Common Category *</label>
                            <select
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                value={data.common_category_id}
                                onChange={(event) => setData('common_category_id', event.target.value)}
                                required
                            >
                                <option value="">Select a category</option>
                                {commonCategories.map((category) => (
                                    <option key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.common_category_id && (
                                <p className="text-sm text-red-500">{errors.common_category_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Sub Category (optional)</label>
                            <select
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                value={data.sub_category_id}
                                onChange={(event) => setData('sub_category_id', event.target.value)}
                            >
                                {subOptions.map((option) => (
                                    <option key={option.id} value={option.id === 0 ? '' : String(option.id)}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            {errors.sub_category_id && (
                                <p className="text-sm text-red-500">{errors.sub_category_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Locations (Cities) *</label>
                            <Select
                                isMulti
                                name="location"
                                options={LOCATION_OPTIONS}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Select multiple cities..."
                                value={data.location ? LOCATION_OPTIONS.filter(option => data.location.split(', ').includes(option.value)) : []}
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions ? (selectedOptions as typeof LOCATION_OPTIONS).map(opt => opt.value).join(', ') : '';
                                    setData('location', values);
                                }}
                                styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      borderColor: state.isFocused ? PINK : '#D1D5DB',
                                      padding: '4px',
                                      borderRadius: '0.5rem',
                                      boxShadow: state.isFocused ? `0 0 0 2px rgba(236, 72, 153, 0.2)` : 'none',
                                      '&:hover': {
                                        borderColor: state.isFocused ? PINK : '#9CA3AF'
                                      }
                                    }),
                                }}
                            />
                            <p className="text-xs text-gray-500">You can select multiple cities to help users find your ad.</p>
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone Number (optional)</label>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    value={data.phone_number}
                                    onChange={(event) => setData('phone_number', event.target.value)}
                                />
                                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">WhatsApp Number (optional)</label>
                                <input
                                    type="tel"
                                    placeholder="Enter WhatsApp number"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    value={data.whatsapp_number}
                                    onChange={(event) => setData('whatsapp_number', event.target.value)}
                                />
                                {errors.whatsapp_number && <p className="text-sm text-red-500">{errors.whatsapp_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Telegram Number (optional)</label>
                                <input
                                    type="tel"
                                    placeholder="Enter Telegram number"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    value={data.telegram_number}
                                    onChange={(event) => setData('telegram_number', event.target.value)}
                                />
                                {errors.telegram_number && <p className="text-sm text-red-500">{errors.telegram_number}</p>}
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 gap-4">
<button
                                onClick={handleDiscard}
                                type="button"
                                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300 sm:mr-auto"
                            >
                                Discard Ad
                            </button>
                            <button
                                onClick={handleNext}
                                type="button"
                                className="rounded-lg bg-pink-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                            >
                                Continue to Details
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div id="step2" className="space-y-6">
                        <div className="border-b pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Step 2: Details &amp; Price</h2>
                            <p className="text-gray-600 mt-1">Add title, description, and pricing information</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ad Title *</label>
                            <input
                                type="text"
                                placeholder="Enter a compelling title for your ad"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                value={data.title}
                                onChange={(event) => setData('title', event.target.value)}
                                required
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ad Description *</label>
                            <textarea
                                rows={6}
                                placeholder="Provide detailed information about the item or service..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                required
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Price *</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">Rs.</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-gray-300 pl-12 pr-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                        value={data.price}
                                        onChange={(event) => setData('price', event.target.value)}
                                        required
                                    />
                                </div>
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-700">Listing Type (optional)</span>
                                <div className="space-y-3">
                                    {listingOptions.map((option) => {
                                        const value = option.id === 0 ? '' : String(option.id);
                                        return (
                                            <label
                                                key={option.id}
                                                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                                            >
                                                <input
                                                    type="radio"
                                                    name="listingCategory"
                                                    value={value}
                                                    checked={data.listing_category_id === value}
                                                    onChange={(event) => setData('listing_category_id', event.target.value)}
                                                    style={{ accentColor: PINK }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{option.name}</span>
                                                    {option.price != null && option.id !== 0 && (
                                                        <span className="text-sm text-gray-500 font-semibold">
                                                            Rs {Number(option.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.listing_category_id && (
                                    <p className="text-sm text-red-500">{errors.listing_category_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 gap-4">
<button
                                onClick={handleDiscard}
                                type="button"
                                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300 sm:mr-auto"
                            >
                                Discard Ad
                            </button>
<div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                type="button"
                                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                type="button"
                                className="rounded-lg bg-pink-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-pink-600"
                            >
                                Continue to Media
                            </button>
                        </div></div>
                    </div>
                );
            case 3:
                return (
                    <div id="step3" className="space-y-6">
                        <div className="border-b pb-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Step 3: Media Upload</h2>
                            <p className="text-gray-600 mt-1">Add photos and videos to showcase your listing</p>
                        </div>

                        <div
                            className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-pink-400"
                            style={{ borderColor: PINK }}
                        >
                            <label className="flex cursor-pointer flex-col items-center space-y-4">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-gray-900">Drag and drop your files here</p>
                                    <p className="text-gray-600">or click to browse</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p>Supported formats: JPG, PNG, GIF</p>
                                    <p>Maximum {maxImages} {maxImages === 1 ? 'file' : 'files'} (5 MB each)</p>
                                    {isEditing && <p className="text-orange-500 mt-1">Uploading new files will remove all existing images.</p>}
                                </div>
                                <span className="rounded-lg bg-pink-100 px-6 py-2 font-semibold text-pink-600 transition-colors hover:bg-pink-200">
                                    Choose Files
                                </span>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            {errors.images && (
                                <p className="mt-4 text-sm text-red-500">{errors.images}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Preview</h3>
                            {previewUrls.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="flex flex-col gap-2">
                                            <div className="overflow-hidden rounded-lg border border-gray-200 aspect-square">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setEditingImageIndex(index)}
                                                className="w-full py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
                                            >
                                                <i className="fas fa-magic mr-1"></i> Hide Face
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : existingImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {existingImages.map((url, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg border border-gray-200 aspect-square relative">
                                            <img
                                                src={url}
                                                alt={`Existing ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                                                Existing
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg bg-gray-100 p-6 text-sm text-gray-500">
                                    Image previews will appear here once you choose files.
                                </div>
                            )}
                            <p className="text-sm text-gray-500">The first image will be used as the main photo.</p>
                        </div>

                        <div className="flex justify-between pt-6 gap-4">
<button
                                onClick={handleDiscard}
                                type="button"
                                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300 sm:mr-auto"
                            >
                                Discard Ad
                            </button>
<div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                type="button"
                                className="rounded-lg bg-gray-200 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-pink-500 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={processing}
                            >
                                {processing ? (isEditing ? 'Updating…' : 'Publishing…') : (isEditing ? 'Update Ad' : 'Publish Ad')}
                            </button>
                        </div></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="border-b bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Ad' : 'Post New Ad'}</h1>
                    <p className="mt-1 text-gray-600">{isEditing ? 'Update your listing details' : 'Create a new listing for your client'}</p>
                    {flash?.success && (
                        <p className="mt-3 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
                            {flash.success}
                        </p>
                    )}
                    {flash?.error && (
                        <p className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                            {flash.error}
                        </p>
                    )}
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                    {STEP_DATA.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <StepIndicator step={step} currentStep={currentStep} />
                            {index < STEP_DATA.length - 1 && (
                                <div
                                    className="h-0.5 w-8 bg-gray-300 sm:w-16"
                                    style={{ backgroundColor: step.id < currentStep ? LIGHT_BLUE : undefined }}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
                <form className="rounded-lg border bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
                    {renderStepContent()}


                </form>
            </div>

                        {/* Custom Discard Confirmation Modal */}
            {showDiscardModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Discard Ad?</h3>
                            <p className="text-gray-500 text-sm">Are you sure you want to discard this ad? All entered details and photos will be permanently lost.</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDiscardModal(false)}
                                className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDiscard}
                                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Yes, Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Editor Modal */}
            <ImageEditorModal
                isOpen={editingImageIndex !== null}
                onClose={() => setEditingImageIndex(null)}
                file={editingImageIndex !== null ? (data.images as File[])[editingImageIndex] : null}
                onSave={handleImageEdited}
            />
        </div>
    );
};

export default PostNewAd;