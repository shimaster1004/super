export interface User {
  id: string;
  email: string | undefined;
  role: string | undefined;
}

export interface AuthStore {
  user: User | null;
  setUser: (paramter: User | null) => void;
  reset: () => Promise<void>;
}

export interface Topic {
  id: number;
  author: string; // 해당 토픽을 작성한 유저의 id
  category: string;
  content: string;
  created_at: string | Date;
  status: string;
  thumbnail: string;
  title: string;
}
