'use server';

import { z } from 'zod';
/* Form validation library that allows us to validate the form data against the invoice schema */
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100; /* Avoid JS floating-point errors */
    const date = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch(error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath(
        '/dashboard/invoices',
    ); /* We've just updated invoices data so we need to clear cache and send a new server request*/
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch(error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices'); // redirect is outside the try catch block because it throws an error in and of itself
  }

 export async function deleteInvoice(id: string) {
    throw new Error('Anuses');
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices'); /* This is being called from dashboard/invoices so no need to redirect. The revalidatePath will trigger a new server request and re-render the table.*/
    } catch(error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }  
  }