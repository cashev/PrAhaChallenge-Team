import { createTaskGenre } from '@/lib/backend/tasks';
import NewGenreForm from './NewGenreForm';

export default function NewGenrePage() {
  async function handleCreateGenre(formData: FormData) {
    'use server'

    const genreName = formData.get('genreName') as string;
    if (!genreName) {
      return { success: false, error: 'Genre name is required' };
    }

    try {
      await createTaskGenre(genreName);
      return { success: true };
    } catch (error) {
      console.error('Failed to create genre:', error);
      return { success: false, error: 'Failed to create genre' };
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">新規ジャンル追加</h1>
      <NewGenreForm handleCreateGenre={handleCreateGenre} />
    </div>
  );
}
