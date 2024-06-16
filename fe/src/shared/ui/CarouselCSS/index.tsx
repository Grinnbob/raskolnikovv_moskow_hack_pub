import styles from './styles.module.scss';
import { twMerge } from 'tailwind-merge';
import { GrPrevious, GrNext } from 'react-icons/gr';

export type CarouselCSSProps<T> = {
  className?: string;
  classNameArrows?: string;
  slides: T[];
  renderSlide: (slide: T) => JSX.Element;
  noScroll?: boolean;
  noControls?: boolean;
  noArrows?: boolean;
};

// use this for simple cases and when we need slide to be in seo
export const CarouselCSS = <T,>({
  className,
  renderSlide,
  slides,
  noScroll,
  classNameArrows,
  noControls,
  noArrows,
}: CarouselCSSProps<T>) => {
  const { controlsJSX, slidesJSX } = slides.reduce(
    (acc, slide, i, thisArr) => {
      if (!noControls) {
        acc.controlsJSX.push(
          <a
            href={`#slide-${i}`}
            className='h-2 w-2 rounded-full bg-strokeLight block hover:bg-textBlue hover:scale-110 transition'
          />,
        );
      }
      acc.slidesJSX.push(
        <div id={`slide-${i}`}>
          {renderSlide(slide)}
          {!noArrows && (
            <>
              <a
                href={`#slide-${i < thisArr.length - 1 ? i + 1 : 0}`}
                className={twMerge(
                  'absolute right-0 h-6 w-6 top-1/2 -translate-y-1/2 z-10',
                  classNameArrows,
                )}
              />
              <a
                href={`#slide-${i ? i - 1 : thisArr.length - 1}`}
                className={twMerge(
                  'absolute left-0 h-6 w-6 top-1/2 -translate-y-1/2 z-10',
                  classNameArrows,
                )}
              />
            </>
          )}
        </div>,
      );
      return acc;
    },
    {
      controlsJSX: [] as JSX.Element[],
      slidesJSX: [] as JSX.Element[],
    },
  );

  return (
    <div className={twMerge(styles.slider, className)}>
      <div className={twMerge(styles.slides, noScroll && styles.noScroll)}>
        {slidesJSX}
      </div>
      {controlsJSX.length > 0 && (
        <div className='flex justify-center gap-1'>{controlsJSX}</div>
      )}
      {!noArrows && (
        <>
          <div
            className={twMerge(
              'pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full',
              classNameArrows,
            )}
          >
            <GrNext size={20} />
          </div>
          <div
            className={twMerge(
              'absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none p-2 bg-white rounded-full',
              classNameArrows,
            )}
          >
            <GrPrevious size={20} />
          </div>
        </>
      )}
    </div>
  );
};
