import { createGenre } from '@/lib/backend/genre';
import GenreForm from '@/app/components/GenreForm';
import { revalidatePath } from 'next/cache';

const NewGenrePage: React.FC = () => {
  async function handleCreateGenre(name: string, displayOrder: number) {
    'use server'
    await createGenre(name, displayOrder);
    revalidatePath('/admin/genres');
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">新規ジャンル追加</h1>
      <GenreForm onSubmit={handleCreateGenre} />
    </div>
  );
}

export default NewGenrePage;
