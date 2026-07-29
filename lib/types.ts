export type ProductCardData = {
  id: string;
  title: string;
  price: number;
  category: string;
  images: { imageUrl: string }[];
  seller: { name: string | null };
  isWishlisted: boolean;
};

export type WishlistCardData = {
  id: string;

  product: {
    id: string;
    title: string;
    price: number;
    category: string;

    images: {
      imageUrl: string;
    }[];

    seller: {
      name: string | null;
    };
  };
};


export type MyListingCardData = {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string;

  images: {
    imageUrl: string;
  }[];
};


export type EditProductData = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: {
    imageUrl: string;
    publicId: string;
  }[];
};