import api from '@/lib/api';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string;
};

async function fetchPosts(): Promise<Post[]> {
  const res = await api.get('/posts');
  return res.data.items;
}

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="block p-4 rounded-lg bg-white shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.summary}</p>
        </Link>
      ))}
    </div>
  );
}
