import { Component, createEffect, createSignal, For, JSX } from "solid-js";
import styles from "../App.module.css";
import { ItemProps, ListRendererProps, TWindow } from "../types/Render.types";

const ListRenderer: Component<ListRendererProps> = ({
  height,
  itemCount,
  itemSize,
  width,
  renderer: Renderer,
  overscanCount = 5,
}) => {
  const windowSize = Math.ceil(height / itemSize);

  const [scrollState, setScrollState] = createSignal(0);

  const [list, setList] = createSignal([]);
  let gridContainerRef: HTMLDivElement;

  createEffect(() => {
    const window = getWindowSize(scrollState(), windowSize, itemSize);
    const windowItems = getWindowItems({
      window,
      overscanCount,
      itemCount,
      itemSize,
    });
    setList(windowItems);
  });

  const handleScroll: JSX.EventHandlerUnion<HTMLDivElement, UIEvent> = (
    event
  ) => {
    setScrollState(event.target.scrollTop);
  };

  return (
    <div
      style={{
        height: wrapPx(height),
        width: wrapPx(width),
      }}
      onscroll={handleScroll}
      class={styles.wrapper}
    >
      <div
        ref={gridContainerRef}
        style={{
          "min-height": wrapPx(itemSize * itemCount),
        }}
      >
        <For each={list()} fallback={<div>Loading...</div>}>
          {Renderer}
        </For>
      </div>
    </div>
  );
};

function getWindowItems({
  window,
  itemSize,
  overscanCount,
  itemCount,
}: {
  itemSize: number;
  window: [number, number];
  overscanCount: number;
  itemCount: number;
}) {
  const items: ItemProps[] = [];
  const startIndex = Math.max(0, window[0] - overscanCount);
  const endIndex = Math.min(window[1] + overscanCount, itemCount);
  for (let index = startIndex; index < endIndex; index++) {
    items.push({
      rowIndex: index,
      style: {
        height: wrapPx(itemSize),
        position: "absolute",
        top: wrapPx((index + 1) * itemSize),
      },
    } as ItemProps);
  }
  return items;
}

function getWindowSize(
  scrollState: number,
  windowSize: number,
  itemSize: number
): TWindow {
  const startIndex = Math.floor(scrollState / itemSize);
  return [startIndex, startIndex + windowSize];
}

function wrapPx(length: number) {
  return `${length}px`;
}
export default ListRenderer;
