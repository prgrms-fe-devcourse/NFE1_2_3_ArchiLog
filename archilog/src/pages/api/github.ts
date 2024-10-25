// src/pages/api/github.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.github.com/users/tree0000/repos', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'archilog'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const data = await response.json();
    
    // 포크된 저장소 제외하고 필요한 데이터만 필터링
    const repos = data
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        updated_at: repo.updated_at
      }))
      .sort((a: any, b: any) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

    res.status(200).json(repos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
  }
}