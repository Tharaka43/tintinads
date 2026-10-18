import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/Footer';
import NavBar from '../../Components/NavBar';

interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    meta_description: string | null;
    created_at: string;
}

interface Props {
    blog: Blog;
    recentBlogs: Blog[];
}

export default function BlogShow({ blog, recentBlogs }: Props) {
    const cleanContent = (content: string) => {
        if (!content) return '';
        // If content already contains HTML tags (like <p>, <div>, <h2>, <table>), render it as-is without injecting stray <br> tags
        if (/<[a-z][\s\S]*>/i.test(content)) {
            return content;
        }
        return content.replace(/\n/g, '<br />');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Head>
                <title>{`${blog?.title || 'Article'} - TinTinAds Blog`}</title>
                <meta name="description" content={blog?.meta_description || blog?.title || 'TinTinAds Article'} />
            </Head>
            
            <NavBar />
            
            <main className="flex-grow max-w-4xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden border border-gray-100">
                    {blog.image && (
                        <div className="w-full h-44 sm:h-72 md:h-96 relative bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="max-h-full max-w-full object-contain p-4"
                            />
                        </div>
                    )}
                    
                    <div className="p-4 sm:p-8 md:p-10">
                        <Link href="/blog" className="inline-flex items-center text-xs sm:text-sm font-semibold text-pink-600 hover:text-pink-700 mb-4 sm:mb-6">
                            <i className="fas fa-arrow-left mr-2"></i> All Articles
                        </Link>
                        
                        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-snug">
                            {blog.title}
                        </h1>
                        
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                            <i className="far fa-calendar-alt mr-2 text-pink-500"></i>
                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                            <span className="mx-2">•</span>
                            <span className="text-gray-400">TinTinAds Editorial</span>
                        </div>

                        <div 
                            className="prose prose-sm sm:prose sm:prose-lg prose-pink max-w-none text-gray-700 leading-relaxed overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: cleanContent(blog.content) }}
                        />
                    </div>
                </article>

                {recentBlogs && recentBlogs.length > 0 && (
                    <div className="mt-8 sm:mt-12">
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4">Read Next</h3>
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {recentBlogs.map((rb) => (
                                <Link key={rb.id} href={`/blog/${rb.slug}`} className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                                    {rb.image && (
                                        <div className="w-full h-32 bg-gray-50 flex items-center justify-center p-3 border-b border-gray-50">
                                            <img src={rb.image} alt={rb.title} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                                        </div>
                                    )}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-pink-600 transition-colors">{rb.title}</h4>
                                        <span className="text-[11px] text-pink-500 font-semibold mt-3 inline-flex items-center">
                                            කියවන්න <i className="fas fa-chevron-right text-[9px] ml-1"></i>
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
