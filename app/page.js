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
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Login with Google
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

      <form onSubmit={addBookmark} className="flex gap-2 mb-6">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1"
          required
        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1"
          required
        />

        <button className="bg-black text-white px-4">
          Add
        </button>

      </form>

      <div className="space-y-2">

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
