import UsersTable from "@/components/users-table";
import createClient from "@/lib/supabase";

export default async function Home() {
  const supabase = createClient();
  const { data: users } = await supabase.from("profiles").select("*");
  return (
    <section className="h-full p-6 w-full space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <UsersTable data={users || []} />
    </section>
  );
}
