"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {

  const [session, setSession] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  

  
  useEffect(() => {

   
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

 
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);


  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

 

  async function fetchBookmarks() {

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  }


  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  

  useEffect(() => {

    if (!session) return;

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "bookmarks"
  },
  (payload) => {
    console.log("Realtime event:", payload);
    fetchBookmarks();
  }
)

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [session]);

  
async function addBookmark(e) {

  e.preventDefault();

  await supabase.from("bookmarks").insert({
    title,
    url,
    user_id: session.user.id
  });

  fetchBookmarks();   

  setTitle("");
  setUrl("");
}
  

  
  async function deleteBookmark(id) {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  }

  
  if (!session) {
    return (
      <div className="flex h-screen justify-center items-center">
        <button
  onClick={login}
  className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl shadow-lg"
>
  Continue with Google
</button>

      </div>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-10">

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Smart Bookmark App</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <form
  onSubmit={addBookmark}
  className="bg-gray-900 p-4 rounded-xl mb-6 flex gap-2"
>

<input
  placeholder="Title"
  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 outline-none focus:border-blue-400"
/>

<input
  placeholder="URL"
  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 flex-1 outline-none focus:border-blue-400"
/>

<button className="bg-blue-500 hover:bg-blue-600 px-4 rounded transition">
  Add
</button>

</form>


      <div className="space-y-2">
       {bookmarks.length === 0 && (
    <p className="text-center text-gray-400 py-10">
      No bookmarks yet — add your first one 🚀
    </p>
  )}


       {bookmarks.map((b) => (

        
  <div key={b.id} className="border p-3 flex justify-between">

    <div>
      <p>{b.title}</p>
      <a href={b.url} target="_blank" className="text-blue-400">
        {b.url}
      </a>
    </div>

    <button onClick={() => deleteBookmark(b.id)}>
      ❌
    </button>

  </div>
  
))}

      </div>

    </main>
  );
}
