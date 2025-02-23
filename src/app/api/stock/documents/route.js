import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

// POST /api/stock/documents - Ajouter des documents à un article
export async function POST(request) {
  try {
    const formData = await request.formData();
    const item_id = formData.get('item_id');
    const documents = formData.getAll('documents');

    if (!item_id || !documents.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Commencer une transaction
    await query('BEGIN');

    try {
      const uploadedDocs = [];

      for (const file of documents) {
        if (!(file instanceof File)) continue;

        // Créer un nom de fichier sécurisé
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'stock', fileName);

        // Sauvegarder le fichier
        const buffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(buffer));

        // Enregistrer dans la base de données
        const result = await query(
          `INSERT INTO inventory_documents (
            item_id,
            file_name,
            original_name,
            file_path,
            file_type,
            file_size
          ) VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`,
          [
            item_id,
            fileName,
            file.name,
            `/uploads/stock/${fileName}`,
            file.type,
            file.size
          ]
        );

        uploadedDocs.push(result.rows[0]);
      }

      await query('COMMIT');

      return NextResponse.json({
        message: 'Documents uploaded successfully',
        documents: uploadedDocs
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Error uploading documents' },
      { status: 500 }
    );
  }
}

// GET /api/stock/documents - Récupérer les documents d'un article
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const item_id = searchParams.get('item_id');

    if (!item_id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT * FROM inventory_documents 
       WHERE item_id = $1 
       ORDER BY created_at DESC`,
      [item_id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Error fetching documents' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/documents - Supprimer un document
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const item_id = searchParams.get('item_id');

    if (!id || !item_id) {
      return NextResponse.json(
        { error: 'Document ID and Item ID are required' },
        { status: 400 }
      );
    }

    // Vérifier si le document existe et appartient à l'article
    const document = await query(
      'SELECT * FROM inventory_documents WHERE id = $1 AND item_id = $2',
      [id, item_id]
    );

    if (document.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Supprimer le fichier physique
    try {
      const filePath = path.join(process.cwd(), 'public', document.rows[0].file_path);
      await unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
      // Continue même si le fichier n'existe pas
    }

    // Supprimer l'enregistrement de la base de données
    await query(
      'DELETE FROM inventory_documents WHERE id = $1',
      [id]
    );

    return NextResponse.json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Error deleting document' },
      { status: 500 }
    );
  }
}