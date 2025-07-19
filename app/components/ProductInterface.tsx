interface WeightsInterface {
  "500gm" : string;
  "1kg" : string;
  "2kg" : string;
  "3kg" : string;
}

export default interface Product {
  pid: string;
  name: string;
  price: number;
  weights: WeightsInterface;
  image_url: string;
  image_id:string;
  category: string;
  isveg: boolean;
  flavor: string;
  description: string;
  created_at:Date
}