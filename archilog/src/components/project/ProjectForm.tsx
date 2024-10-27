// src/components/project/ProjectForm.tsx
import { useState } from 'react';

interface ProjectFormProps {
  onSubmit: (data: { repoUrl: string; description: string }) => Promise<void>;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({ repoUrl, description });
      setRepoUrl('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-800/50 rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a brief description of your project"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Adding Project...' : 'Add Project'}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </form>
  );
}