import './App.css';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Post 1"},
  { id: 2, title: "Post 2"}
]

function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

function App() {
  const queryClient = useQueryClient()
  
  console.log("POSTS", POSTS)

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => [...POSTS])
  })

  const newPostMutation = useMutation({
    mutationFn: title => {
      return wait(1000).then(() => 
        POSTS.push({ id: crypto.randomUUID(), title })
    )
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["posts"])
  }
})

  if (postsQuery.isLoading) return <h1>Loading...</h1>
  if (postsQuery.error) return <pre>{JSON.stringify(postsQuery.error)}</pre>
  
return (
  <div>
    {postsQuery.data.map(post => (
      <div key={post.id}>{post.title}</div>
    ))}
    <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post, Eh")}>
      Add New 
    </button>
  </div>
)
}

export default App;
