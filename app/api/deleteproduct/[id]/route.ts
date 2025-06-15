import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
    return NextResponse.json({ message: 'Product Deleted Successfully!' });
  } catch (error) {
    return NextResponse.json({ message: 'Server Issue!' }, { status: 500 });
  }
}
