export interface signUp{
  name:string,
  email:string,
  password:string
}

export interface login{
  email:string,
  password:string
}

export interface product {
  id: string;
  name: string;
  price: string;
  color: string;
  category: string;
  description: string;
  imageUrl: string;
}

