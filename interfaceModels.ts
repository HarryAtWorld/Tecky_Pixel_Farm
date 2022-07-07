export interface userType {
  id: number;
  login_account: string;
  user_name: string;
  user_icon: string;
}

export interface rankingLevel {
  id: number;
  name: string;
  score: number;
}

export interface friendRowA {
  user_id_a: number;
}
export interface friendRowB {
  user_id_b: number;
}

export interface friendArray {
  user_id: number;
}
