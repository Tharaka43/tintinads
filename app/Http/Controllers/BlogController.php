<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Ensure blogs table exists and is seeded with initial SEO articles.
     */
    private function ensureBlogsTableExists()
    {
        if (!\Illuminate\Support\Facades\Schema::hasTable('blogs')) {
            \Illuminate\Support\Facades\Schema::create('blogs', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->longText('content');
                $table->string('image')->nullable();
                $table->string('meta_description')->nullable();
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        // Auto-seed if empty
        if (Blog::count() === 0) {
            $this->seedInitialBlogs();
        }
    }

    private function seedInitialBlogs()
    {
        $seoBlogsFile = base_path('seo_blogs.json');
        if (file_exists($seoBlogsFile)) {
            $blogsData = json_decode(file_get_contents($seoBlogsFile), true);
            if (!empty($blogsData)) {
                foreach ($blogsData as $b) {
                    Blog::updateOrCreate(
                        ['slug' => $b['slug']],
                        [
                            'title' => $b['title'],
                            'content' => $b['content'],
                            'image' => $b['image'] ?? null,
                            'meta_description' => $b['meta_description'] ?? null,
                            'is_published' => true,
                        ]
                    );
                }
            }
        }
    }

    /**
     * Display a listing of the resource for the public.
     */
    public function index()
    {
        $this->ensureBlogsTableExists();

        $blogs = Blog::where('is_published', true)->latest()->paginate(12);
        return Inertia::render('Blog/Index', [
            'blogs' => $blogs
        ]);
    }

    /**
     * Display the specified resource for the public.
     */
    public function show($slug)
    {
        $this->ensureBlogsTableExists();

        $blog = Blog::where('slug', $slug)->where('is_published', true)->first();

        // Fallback: If not found in database or if it needs updated responsive content, re-seed from seo_blogs.json
        if (!$blog || !str_contains($blog->content, 'md:hidden')) {
            $this->seedInitialBlogs();
            $blog = Blog::where('slug', $slug)->where('is_published', true)->first();
        }

        if (!$blog) {
            abort(404, 'Blog post not found.');
        }
        
        // Also fetch a few recent blogs for "Related Articles"
        $recentBlogs = Blog::where('is_published', true)
                            ->where('id', '!=', $blog->id)
                            ->latest()
                            ->take(3)
                            ->get();

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'recentBlogs' => $recentBlogs
        ]);
    }

    /**
     * Super Admin: Display all blogs
     */
    public function adminIndex()
    {
        $blogs = Blog::latest()->paginate(20);
        return Inertia::render('SuperAdmin/Blogs/Index', [
            'blogs' => $blogs
        ]);
    }

    /**
     * Super Admin: Store a newly created blog in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_description' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $data = $request->except('image');
        $data['slug'] = Str::slug($request->title) . '-' . uniqid();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $data['image'] = '/storage/' . $path;
        }

        Blog::create($data);

        return redirect()->back()->with('success', 'Blog created successfully.');
    }

    /**
     * Super Admin: Update the specified blog in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_description' => 'nullable|string|max:255',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $data = $request->except('image');

        if ($request->title !== $blog->title) {
            $data['slug'] = Str::slug($request->title) . '-' . uniqid();
        }

        if ($request->hasFile('image')) {
            // delete old image if exists
            if ($blog->image && str_starts_with($blog->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $blog->image));
            }
            $path = $request->file('image')->store('blogs', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $blog->update($data);

        return redirect()->back()->with('success', 'Blog updated successfully.');
    }

    /**
     * Super Admin: Remove the specified blog from storage.
     */
    public function destroy(Blog $blog)
    {
        if ($blog->image && str_starts_with($blog->image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $blog->image));
        }
        $blog->delete();

        return redirect()->back()->with('success', 'Blog deleted successfully.');
    }
}
