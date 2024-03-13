/*
To create an invoice:

    Create a form to capture the user's input.
    Create a Server Action and invoke it from the form.
    Inside your Server Action, extract the data from the formData object.
    Validate and prepare the data to be inserted into your database.
    Insert the data and handle any errors.
    Revalidate the cache and redirect the user back to invoices page.

Server actions allow for running async code directly on the server and replace API endpoints to mutate data.

*/

import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Create Invoice',
                        href: '/dashboard/invoices/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}

/* Server component that fetches customers and passes it to the Form component */
