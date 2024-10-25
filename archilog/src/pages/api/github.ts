// src/pages/api/github/repos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.github_token;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Project Gallery'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    
    const filteredRepos = repos
      .filter((repo: any) => !repo.fork)
      .sort((a: any, b: any) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

    res.status(200).json(filteredRepos);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
}