// src/pages/api/github/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // 토큰을 쿠키에 저장
    res.setHeader('Set-Cookie', `github_token=${tokenData.access_token}; Path=/; HttpOnly; SameSite=Lax`);
    
    // 프로젝트 페이지로 리다이렉트
    res.redirect('/project');
  } catch (error) {
    console.error('Error during GitHub authentication:', error);
    res.redirect('/error?message=Authentication failed');
  }
}