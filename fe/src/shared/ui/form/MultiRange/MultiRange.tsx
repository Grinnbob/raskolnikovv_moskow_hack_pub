import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from 'react';
import styles from './styles.module.scss';
import cx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type MultiRange = { min: number; max: number };

export interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: ({ min, max }: MultiRange) => void;
  nameMin?: string;
  nameMax?: string;
  defaultMin?: string;
  defaultMax?: string;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  nameMin,
  nameMax,
  onChange,
  defaultMax,
  defaultMin,
}) => {
  const [minVal, setMinVal] = useState<number>(Number(defaultMin) || min);
  const [maxVal, setMaxVal] = useState<number>(Number(defaultMax) || max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  useEffect(() => {
    if (maxValRef.current && range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    if (minValRef.current && range.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className={styles.container}>
      <input
        type='range'
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={cx(styles.thumb, styles['thumb--zindex-3'], {
          [styles['thumb--zindex-5']]: minVal > max - 100,
        })}
        name={nameMin}
      />
      <input
        type='range'
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className={cx(styles.thumb, styles['thumb--zindex-4'])}
        name={nameMax}
      />

      <div className={styles.slider}>
        <div className={styles.slider__track} />
        <div
          ref={range}
          className={twMerge(styles.slider__range, 'bg-textBlue')}
        />
      </div>
    </div>
  );
};

export default MultiRangeSlider;
