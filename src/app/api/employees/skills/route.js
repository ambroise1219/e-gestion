import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/employees/skills - Get employee skills
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userSkills = await query(`
      SELECT 
        s.id,
        s.name,
        s.category,
        s.description,
        us.level,
        us.verified
      FROM skills s
      INNER JOIN user_skills us ON s.id = us.skill_id
      WHERE us.user_id = $1
      ORDER BY s.category, s.name
    `, [userId]);

    return NextResponse.json(userSkills);
  } catch (error) {
    console.error('Error fetching employee skills:', error);
    return NextResponse.json(
      { error: 'Error fetching employee skills' },
      { status: 500 }
    );
  }
}

// POST /api/employees/skills - Add skill to employee
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, skillId, level } = body;

    // Validate required fields
    if (!userId || !skillId || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate skill level
    if (level < 1 || level > 5) {
      return NextResponse.json(
        { error: 'Skill level must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if skill already exists for user
    const existingSkill = await query(
      'SELECT user_id FROM user_skills WHERE user_id = $1 AND skill_id = $2',
      [userId, skillId]
    );

    if (existingSkill.length > 0) {
      return NextResponse.json(
        { error: 'Skill already assigned to user' },
        { status: 400 }
      );
    }

    // Add skill to user
    const result = await query(
      'INSERT INTO user_skills (user_id, skill_id, level) VALUES ($1, $2, $3) RETURNING *',
      [userId, skillId, level]
    );

    return NextResponse.json({
      message: 'Skill added successfully',
      skill: result[0]
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding employee skill:', error);
    return NextResponse.json(
      { error: 'Error adding employee skill' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/skills - Update employee skill
export async function PUT(req) {
  try {
    const body = await req.json();
    const { userId, skillId, level, verified } = body;

    if (!userId || !skillId) {
      return NextResponse.json(
        { error: 'User ID and Skill ID are required' },
        { status: 400 }
      );
    }

    // Build update query
    let updates = [];
    let values = [userId, skillId];
    let valueIndex = 3;

    if (level !== undefined) {
      if (level < 1 || level > 5) {
        return NextResponse.json(
          { error: 'Skill level must be between 1 and 5' },
          { status: 400 }
        );
      }
      updates.push(`level = $${valueIndex}`);
      values.push(level);
      valueIndex++;
    }

    if (verified !== undefined) {
      updates.push(`verified = $${valueIndex}`);
      values.push(verified);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE user_skills 
       SET ${updates.join(', ')} 
       WHERE user_id = $1 AND skill_id = $2 
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Skill updated successfully',
      skill: result[0]
    });
  } catch (error) {
    console.error('Error updating employee skill:', error);
    return NextResponse.json(
      { error: 'Error updating employee skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/skills - Remove skill from employee
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const skillId = searchParams.get('skillId');

    if (!userId || !skillId) {
      return NextResponse.json(
        { error: 'User ID and Skill ID are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING *',
      [userId, skillId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Skill not found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Skill removed successfully'
    });
  } catch (error) {
    console.error('Error removing employee skill:', error);
    return NextResponse.json(
      { error: 'Error removing employee skill' },
      { status: 500 }
    );
  }
}