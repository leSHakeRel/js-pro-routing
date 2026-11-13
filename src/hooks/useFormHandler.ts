import type { Store } from '../store/store';

/** Конфигурация полей формы: ключ → функция-трансформер значения */
export type FieldTransformers = Record<string, (value: string) => unknown>;

/** Конфигурация для useFormHandler */
export interface FormHandlerConfig {
  /** Селектор формы (например, '#my-form') */
  formSelector: string;
  /** Маппинг полей: name поля → функция преобразования значения */
  fields: FieldTransformers;
}

/** Интерфейс возвращаемого объекта */
export interface FormHandler {
  /** Собрать данные из формы и сохранить в store */
  save: () => void;
  /** Сбросить форму к состоянию из store */
  reset: () => void;
  /** Получить текущие значения */
  getValues: () => Record<string, unknown>;
  /** Установить значения */
  setValues: (values: Record<string, unknown>) => void;
}

/**
 * Кастомный хук для работы с формой.
 *
 * @param store - глобальный store
 * @param config - конфигурация формы
 * 
 */
export function useFormHandler(
  store: Store,
  config: FormHandlerConfig,
): FormHandler {
  const getForm = (): HTMLFormElement | null =>
    document.querySelector<HTMLFormElement>(config.formSelector);

  const getValues = (): Record<string, unknown> => {
    const form = getForm();
    if (!form) return {};

    const data = new FormData(form);
    const values: Record<string, unknown> = {};

    for (const [key, transform] of Object.entries(config.fields)) {
      const raw = data.get(key);
      values[key] = transform(String(raw ?? ''));
    }

    return values;
  };

  const setValues = (values: Record<string, unknown>): void => {
    const form = getForm();
    if (!form) return;

    for (const [key, value] of Object.entries(values)) {
      const input = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[name="${key}"]`,
      );
      if (input) {
        if (input.type === 'checkbox') {
          (input as HTMLInputElement).checked = Boolean(value);
        } else {
          input.value = String(value);
        }
      }
    }
  };

  const save = (): void => {
    const values = getValues();
    store.setState(values as Record<string, unknown>);
  };

  const reset = (): void => {
    const state = store.getState();
    setValues(state as unknown as Record<string, unknown>);
  };

  return { save, reset, getValues, setValues };
}