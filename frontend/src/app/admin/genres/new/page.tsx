import { createTaskGenre } from '@/lib/backend/tasks';
import GenreForm from '@/app/components/GenreForm';
import { revalidatePath } from 'next/cache';

const NewGenrePage: React.FC = () => {
  async function handleCreateGenre(genreName: string) {
    'use server'
    await createTaskGenre(genreName);
    revalidatePath('/admin/genres');
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">新規ジャンル追加</h1>
      <GenreForm onSubmit={handleCreateGenre} />
    </div>
  );
}

export default NewGenrePage;
