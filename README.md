# Dynamic Scroll 

Predefined component that loads glb and texture (jpg/png) with transparency and opacity. opacity is controlled by a global state management and custom hook to be used inside r3f or html components

## How to use

You need to add Provider at the top level so offset value will be shared accross. 
Alternative way is to only use offset inside canvas component, but adding the value to a provider is more sustainable.

- Add provider:

```js
<React.StrictMode>
  <ExtendedScrollProvider>
    <App />
  </ExtendedScrollProvider>
</React.StrictMode>
```

- Construct objects:

```js
<ExtendedScrollComp>
  {({ ModelLoader, TextureLoader }) => {
    return (
      <>
        <ModelLoader
          // ref 
          // group props
          position={[0, 0, 2]}
          url='/chair.glb' // pass url of the glb
          min={0.5} // min offset 0-1
          max={1} // max offset 0-1
        />
        <ModelLoader
          position={[0, 0, 4]}
          url='/table.glb'
          min={0}
          max={1}
        />
        <TextureLoader
          // ref
          // group props
          url='/chair.png' // pass png file
          min={0} // min offset 0-1
          max={0.5} // max offset 0-1
          size={new Vector2(3, 3)} // size of the plane geometry
          rotation={[0, 0, Math.PI]}
          position={[0, 0, 0]}
        />
      </>
    );
  }}
</ExtendedScrollComp>
```

- Use custom hook in r3f component:

```js
    const scroll = useOffsetScroll();

    useFrame(() => {
        scroll.offset  = value
    })
```

- Use custom hook in html component:

```js
    const scroll = useOffsetScroll();

    React.useEffect(() => {
        const effect = addEffect(() => {
            scroll.offset = state.offset
        });
        return () => {
            effect();
        };
    }, []);
```