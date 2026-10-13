import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/Footer';
import NavBar from '../../Components/NavBar';

interface Blog {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    meta_description: string | null;
    created_at: string;
}

interface Props {
    blogs: {
        data: Blog[];
        links: any[];
    };
}

export default function BlogIndex({ blogs }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Head title="Blog - TinTinAds" />
            
            <NavBar />
            
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        TinTinAds Blog
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Latest updates, tips, and articles about services in Sri Lanka.
                    </p>
                </div>

                {blogs.data.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm">
                        No articles published yet. Check back soon!
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.data.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.slug}`} className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src={blog.image || '/assets/sitelogo.png'} 
                                        alt={blog.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-sm text-pink-600 font-semibold mb-2">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-3 flex-1 text-sm">
                                        {blog.meta_description || 'Read more about this topic by clicking here.'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
