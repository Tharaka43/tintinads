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
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Head>
                <title>{blog.title} - TinTinAds Blog</title>
                <meta name="description" content={blog.meta_description || blog.title} />
            </Head>
            
            <NavBar />
            
            <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <article className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    {blog.image && (
                        <div className="w-full h-[400px] relative">
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-8 md:p-12">
                        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 mb-6">
                            <i className="fas fa-arrow-left mr-2"></i> Back to Blog
                        </Link>
                        
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-10 pb-10 border-b border-gray-100">
                            <i className="far fa-calendar-alt mr-2"></i>
                            {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        {/* Note: In a real app, you might want to use a rich text editor and dangerouslySetInnerHTML. 
                            For now, we'll render it safely or allow simple HTML if you trust the admin input. */}
                        <div 
                            className="prose prose-lg prose-pink max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
                        />
                    </div>
                </article>

                {recentBlogs && recentBlogs.length > 0 && (
                    <div className="mt-16">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Read Next</h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            {recentBlogs.map((rb) => (
                                <Link key={rb.id} href={`/blog/${rb.slug}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {rb.image && (
                                        <img src={rb.image} alt={rb.title} className="w-full h-32 object-cover" />
                                    )}
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 line-clamp-2">{rb.title}</h4>
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
