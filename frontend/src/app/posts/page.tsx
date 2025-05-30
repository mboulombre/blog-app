import  {apiClient  } from '@/lib/api';
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string;
};


export default async function PostsPage() {
  const posts = await apiClient.getPosts();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="block p-4 rounded-lg bg-white shadow hover:shadow-md transition">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.content}</p>
        </Link>
      ))}
    </div>
  );
}
