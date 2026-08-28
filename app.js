const screen = document.getElementById("screen");

const state = {
  step: 0,
  product: null,
  segment: null,
  value: null,
  pricing: null,
  guardrail: null,
  revisionUsed: false
};

const products = {
  contracts: {
    title: "AI-анализ договоров",
    short: "AI-анализ договоров",
    detail: "Находит потенциально опасные условия и помогает быстрее провести юридическую проверку.",
    costDriver: "Длина документа, глубина проверки и повторный анализ"
  },
  marketing: {
    title: "AI-помощник маркетолога",
    short: "AI-помощник маркетолога",
    detail: "Помогает быстрее создавать и адаптировать материалы для сегментов и каналов.",
    costDriver: "Количество вариантов, итераций и контекст бренда"
  },
  support: {
    title: "AI-агент поддержки",
    short: "AI-агент поддержки",
    detail: "Обрабатывает типовые обращения и помогает оператору в сложных случаях.",
    costDriver: "Длина диалога, уточнения, повторные обращения и эскалации"
  }
};

const segments = {
  small: {
    title: "Небольшая юридическая команда",
    short: "Небольшая команда",
    detail: "Проверяет 20–30 договоров в месяц и хочет заранее понимать расходы.",
    priority: "предсказуемость бюджета"
  },
  enterprise: {
    title: "Корпоративный юридический департамент",
    short: "Корпоративный департамент",
    detail: "Работает с длинными договорами и не может пропускать существенные риски.",
    priority: "качество глубокой проверки"
  },
  agency: {
    title: "Юридический аутсорсер",
    short: "Юридический аутсорсер",
    detail: "Нагрузка меняется от месяца к месяцу, а стоимость нужно переносить на проекты.",
    priority: "гибкость при пиковом спросе"
  }
};

const values = {
  speed: {
    title: "Экономия времени",
    short: "быстрее проверять договоры",
    detail: "Сократить ручную работу и быстрее передавать договор на согласование."
  },
  risk: {
    title: "Снижение риска",
    short: "не пропускать опасные условия",
    detail: "Сделать существенные риски заметными до подписания договора."
  },
  completion: {
    title: "Готовая проверка",
    short: "получать завершённую проверку",
    detail: "Получить понятный разбор договора, с которым можно принять решение."
  }
};

const pricing = {
  access: {
    title: "Доступ",
    phrase: "доступ к AI-анализу",
    detail: "Фиксированная плата за период без счётчика каждой проверки.",
    eventTitle: "Активность оказалась неравномерной",
    eventQuote: "10% клиентов создают большую часть вычислительной нагрузки.",
    eventDetail: "Свобода использования помогает внедрению, но активные команды делают себестоимость непредсказуемой.",
    experiment: "смоделировать распределение использования и проверить восприятие fair use"
  },
  operation: {
    title: "Операция",
    phrase: "каждую завершённую проверку",
    detail: "Клиент платит за понятное действие — анализ одного договора.",
    eventTitle: "Счётчик изменил поведение",
    eventQuote: "Пользователи стали реже перепроверять сложные договоры.",
    eventDetail: "Цена следует за использованием, но каждое дополнительное действие начинает ощущаться как расход.",
    experiment: "проверить, подавляет ли видимый счётчик полезные повторные проверки"
  },
  result: {
    title: "Результат",
    phrase: "подтверждённый результат проверки",
    detail: "Цена привязана к эффекту, а не к внутреннему объёму вычислений.",
    eventTitle: "Результат понимают по-разному",
    eventQuote: "Для клиента результат — решение, а для продукта — сформированный отчёт.",
    eventDetail: "Цена близка к ценности, но стороны должны одинаково понимать момент достижения результата.",
    experiment: "попросить пять клиентов независимо определить, когда проверка считается завершённой"
  }
};

const guardrails = {
  limit: {
    title: "Включённый лимит",
    phrase: "понятный включённый объём",
    detail: "После порога использование останавливается или требует перехода на другой пакет.",
    experiment: "проверить реакцию на остановку полезного сценария в момент достижения лимита"
  },
  addon: {
    title: "Дополнительный пакет",
    phrase: "пакеты дополнительного объёма",
    detail: "Базовое потребление включено, а пиковый объём можно докупить.",
    experiment: "дать клиентам объяснить тариф своими словами и найти потерянные условия"
  },
  deep: {
    title: "Отдельный глубокий режим",
    phrase: "отдельно оплачиваемый глубокий режим",
    detail: "Быстрый анализ входит в основу, длинные и сложные документы проверяются отдельно.",
    experiment: "проверить, видит ли клиент различимую дополнительную ценность глубокого режима"
  }
};

const reactions = {
  access: {
    limit: {
      quote: "Я оплатил доступ, но сервис остановился посреди важной проверки. За что тогда я плачу?",
      insight: "Слово «доступ» звучит как возможность пользоваться продуктом постоянно, а лимит фактически её прерывает.",
      question: "Какой объём включить в тариф и как заранее объяснить лимит, чтобы остановка не стала неожиданностью?"
    },
    addon: {
      quote: "Почему после оплаты доступа я должен снова платить, когда начинаю пользоваться продуктом чаще?",
      insight: "Активный клиент быстрее расходует включённый объём и может воспринять доплату как штраф за регулярное использование.",
      question: "Понимает ли клиент, какой объём уже включён и за какую дополнительную пользу он доплачивает?"
    },
    deep: {
      quote: "Я уже оплатил проверку договоров. Что конкретно даст более глубокий режим?",
      insight: "Клиенту трудно увидеть границу между обычной и углублённой проверкой до получения результата.",
      question: "Может ли клиент заранее понять различие режимов по конкретному результату, а не по внутренней сложности работы AI?"
    }
  },
  operation: {
    limit: {
      quote: "Я плачу за проверку каждого договора. Почему тогда есть ещё и общий лимит?",
      insight: "Клиент сталкивается сразу с двумя ограничениями: платой за каждую проверку и общим потолком использования.",
      question: "Нужны ли оба ограничения или одно из них можно убрать без неприемлемого роста затрат?"
    },
    addon: {
      quote: "Почему одинаковая проверка стоит по-разному в зависимости от того, закончился пакет или нет?",
      insight: "Цена одной и той же проверки становится менее предсказуемой из-за пакетов.",
      question: "Можно ли показать клиенту одну понятную цену проверки и при этом контролировать затраты?"
    },
    deep: {
      quote: "Итоговая цена зависит от количества договоров или от глубины проверки?",
      insight: "На стоимость одновременно влияют число проверок и выбранный режим, поэтому её сложно оценить заранее.",
      question: "Как объяснить расчёт цены одним коротким правилом и сможет ли клиент заранее посчитать расходы?"
    }
  },
  result: {
    limit: {
      quote: "Я плачу за готовый разбор договора. Почему проверка может остановиться до готового результата?",
      insight: "Тариф обещает результат, но внутренний лимит продукта может помешать его получить.",
      question: "Можно ли ограничить дорогие случаи так, чтобы уже начатая проверка всегда завершалась понятным результатом?"
    },
    addon: {
      quote: "Я покупаю готовый разбор или несколько попыток его получить?",
      insight: "Пакет снова переводит внимание с результата на количество действий внутри продукта.",
      question: "Какие действия и доработки входят в один оплаченный результат, а за что действительно нужна доплата?"
    },
    deep: {
      quote: "Как до начала проверки понять, что моему договору нужен дорогой глубокий режим?",
      insight: "Клиент ещё не видел результат и не всегда может сам оценить сложность договора.",
      question: "Кто выбирает режим, по каким понятным признакам и узнаёт ли клиент полную цену до начала проверки?"
    }
  }
};

const marketingSegments = {
  small: {
    title: "Небольшая внутренняя команда",
    short: "Небольшая маркетинговая команда",
    detail: "Регулярно выпускает материалы ограниченным составом и хочет заранее понимать стоимость.",
    priority: "простота и предсказуемая стоимость"
  },
  enterprise: {
    title: "Маркетинговая функция крупной компании",
    short: "Маркетинг крупной компании",
    detail: "Работает с несколькими продуктами, сегментами, брендами и согласующими.",
    priority: "управляемость качества и единообразия"
  },
  agency: {
    title: "Маркетинговое агентство",
    short: "Маркетинговое агентство",
    detail: "Объём резко растёт в периоды запусков и зависит от клиентских проектов.",
    priority: "масштабирование в пики и переносимость затрат на проект"
  }
};

const marketingValues = {
  speed: {
    title: "Скорость производства",
    short: "быстрее готовить рабочие материалы",
    detail: "Сократить путь от задачи до первого рабочего варианта без потери качества."
  },
  variation: {
    title: "Адаптация под сегменты",
    short: "получать релевантные варианты для сегментов и каналов",
    detail: "Быстрее адаптировать одно сообщение под аудитории, форматы и точки контакта."
  },
  completion: {
    title: "Готовый материал",
    short: "получать материал, готовый к использованию",
    detail: "Довести материал от черновика до состояния, которое можно согласовать и выпустить."
  }
};

const marketingPricing = {
  access: {
    title: "Доступ",
    phrase: "доступ команды к AI-помощнику",
    detail: "Фиксированная плата за период без счётчика каждой генерации.",
    eventTitle: "Итерации стали бесконечными",
    eventQuote: "Активные команды создают десятки вариантов и постоянно возвращаются к правкам.",
    eventDetail: "Свобода творчества помогает внедрению, но количество итераций растёт быстрее клиентской ценности.",
    experiment: "сравнить потребление лёгких и активных команд и понять, растёт ли ценность вместе с числом итераций"
  },
  operation: {
    title: "Операция",
    phrase: "каждый созданный или переработанный материал",
    detail: "Клиент платит за понятное действие — создание или переработку материала.",
    eventTitle: "Команды перестали экспериментировать",
    eventQuote: "Пользователи сокращают число вариантов, чтобы не расходовать операции.",
    eventDetail: "Использование измеримо, но счётчик может уничтожить ценность AI как инструмента экспериментов.",
    experiment: "проверить, как пользователи определяют один материал и меняет ли счётчик желание экспериментировать"
  },
  result: {
    title: "Результат",
    phrase: "материал, принятый в работу или согласованный",
    detail: "Цена привязана к готовому материалу, а не к числу внутренних итераций.",
    eventTitle: "Никто не согласен, что материал готов",
    eventQuote: "AI создал текст, но редактор, бренд и заказчик продолжают доработки.",
    eventDetail: "Результат зависит от общего процесса и нескольких участников, а не только от генерации.",
    experiment: "попросить участников процесса независимо отметить момент, когда материал становится готовым результатом"
  }
};

const marketingGuardrails = {
  limit: {
    title: "Включённый лимит",
    phrase: "включённый объём материалов и генераций",
    detail: "В тариф входит определённое число материалов или генераций до понятного порога.",
    experiment: "проверить на реальном рабочем цикле, когда лимит начинает останавливать полезную итерацию"
  },
  addon: {
    title: "Дополнительный пакет",
    phrase: "пакеты дополнительного объёма",
    detail: "Дополнительные материалы и пиковый объём приобретаются сверх базы.",
    experiment: "проверить, может ли команда заранее отнести пакет на конкретный проект и объяснить его заказчику"
  },
  deep: {
    title: "Профессиональный режим",
    phrase: "отдельный профессиональный режим",
    detail: "Базовые черновики включены, сложная адаптация под бренд и сегменты оплачивается отдельно.",
    experiment: "сравнить восприятие результата базового и профессионального режима без показа названий тарифов"
  }
};

const marketingReactions = {
  access: {
    limit: {
      quote: "Я оплатил инструмент для постоянной работы, но лимит закончился до того, как мы выбрали финальный вариант.",
      insight: "В маркетинге хороший материал часто появляется после нескольких итераций, а лимит может прервать работу раньше.",
      question: "Какой объём покрывает обычный рабочий процесс команды и что происходит, если лимит закончился перед запуском?"
    },
    addon: {
      quote: "Чем активнее команда использует продукт, тем чаще приходится доплачивать. Почему это выгодно нам?",
      insight: "После успешного внедрения расходы растут, но дополнительная ценность тарифа может быть неочевидна.",
      question: "Видит ли клиент связь между доплатой и дополнительным результатом, а не только с числом генераций?"
    },
    deep: {
      quote: "Почему адаптация под наш бренд не входит в продукт, который предназначен для маркетологов?",
      insight: "Важная для профессиональной работы функция вынесена в более дорогой режим.",
      question: "Достаточно ли полезен базовый режим сам по себе и ясно ли, какой дополнительный результат даёт профессиональный?"
    }
  },
  operation: {
    limit: {
      quote: "Я плачу за каждый материал и всё равно могу упереться в общий лимит?",
      insight: "Клиенту приходится следить и за числом оплаченных материалов, и за общим ограничением.",
      question: "Нужны ли два ограничения или тариф можно упростить до одного понятного правила?"
    },
    addon: {
      quote: "Что считается одним материалом: заголовок, несколько вариантов или готовая публикация?",
      insight: "Единицу оплаты можно трактовать по-разному, поэтому клиент не понимает будущую стоимость.",
      question: "Одинаково ли клиенты и команда продукта определяют один оплачиваемый материал на реальных примерах?"
    },
    deep: {
      quote: "Я плачу за каждый материал. За что ещё нужно доплачивать в профессиональном режиме?",
      insight: "Цена зависит и от количества материалов, и от сложности их подготовки.",
      question: "Можно ли одним предложением объяснить, что входит в обычный материал и какую отдельную ценность даёт профессиональный режим?"
    }
  },
  result: {
    limit: {
      quote: "Я плачу за готовый материал, но лимит закончился до того, как его согласовала команда.",
      insight: "Для клиента результат — это пригодный к публикации материал, а продукт может считать и ограничивать промежуточные итерации.",
      question: "В какой момент результат считается готовым и сколько доработок должно входить в его цену?"
    },
    addon: {
      quote: "Я покупаю готовый материал или пакет попыток, среди которых ещё нужно найти подходящую?",
      insight: "Клиент берёт на себя риск того, сколько итераций потребуется до приемлемого результата.",
      question: "Какие доработки входят в оплату результата, а какие уже означают новую задачу?"
    },
    deep: {
      quote: "Если я плачу за готовый результат, почему соответствие нашему бренду оплачивается отдельно?",
      insight: "Клиент может считать соответствие бренду обязательным качеством результата, а не дополнительной услугой.",
      question: "Что является полноценным базовым результатом и какую заметную дополнительную пользу даёт профессиональный режим?"
    }
  }
};

const supportSegments = {
  small: {
    title: "Небольшая служба поддержки",
    short: "Небольшая служба поддержки",
    detail: "Хочет разгрузить сотрудников от типовых обращений без сложной тарифной модели.",
    priority: "простота внедрения и предсказуемая стоимость"
  },
  enterprise: {
    title: "Крупный контакт-центр",
    short: "Крупный контакт-центр",
    detail: "Обрабатывает большой поток, сложные уточнения и эскалации.",
    priority: "стабильное качество и соблюдение уровня сервиса"
  },
  outsourcer: {
    title: "Аутсорсинговый контакт-центр",
    short: "Аутсорсинговый контакт-центр",
    detail: "Обслуживает несколько клиентов с разной сезонностью и сложностью обращений.",
    priority: "управление пиками и распределение затрат по клиентам"
  }
};

const supportValues = {
  speed: {
    title: "Быстрый ответ",
    short: "сокращать время ответа клиенту",
    detail: "Быстрее давать первый полезный ответ без снижения качества обслуживания."
  },
  resolution: {
    title: "Решённое обращение",
    short: "доводить обращение до решения",
    detail: "Помочь клиенту решить задачу, а не только формально закрыть обращение."
  },
  capacity: {
    title: "Разгрузка команды",
    short: "обрабатывать больше обращений без пропорционального роста команды",
    detail: "Передать AI типовые случаи и сохранить время сотрудников для сложных задач."
  }
};

const supportPricing = {
  access: {
    title: "Доступ",
    phrase: "доступ к AI-агенту за период",
    detail: "Фиксированная плата за период без счётчика каждого обращения.",
    eventTitle: "Пик обращений съел экономику",
    eventQuote: "Сезонный всплеск и длинные диалоги резко увеличили нагрузку.",
    eventDetail: "Фиксированная цена предсказуема для клиента, но не учитывает интенсивность и сложность общения.",
    experiment: "смоделировать обычные и пиковые периоды, включая длинные диалоги и эскалации"
  },
  operation: {
    title: "Операция",
    phrase: "каждое обработанное обращение",
    detail: "Клиент платит за понятное действие — обработку одного обращения.",
    eventTitle: "Обращения начали закрывать слишком рано",
    eventQuote: "Формально обработанные обращения возвращаются уточнениями и эскалациями.",
    eventDetail: "Оплата за обращение может оптимизировать счётчик, а не решение задачи клиента.",
    experiment: "проверить, можно ли однозначно определить одно обращение и не стимулирует ли цена преждевременное закрытие"
  },
  result: {
    title: "Результат",
    phrase: "решённое обращение",
    detail: "Цена привязана к решению задачи клиента, а не к числу сообщений.",
    eventTitle: "Решение снова стало обращением",
    eventQuote: "Закрытый запрос открылся повторно или потребовал участия оператора.",
    eventDetail: "Нужно определить период и критерий, после которого обращение действительно считается решённым.",
    experiment: "определить окно, в котором повторное обращение считается продолжением нерешённой задачи"
  }
};

const supportGuardrails = {
  limit: {
    title: "Включённый лимит",
    phrase: "включённый объём обращений",
    detail: "В тариф входит объём обращений или диалогов до понятного порога.",
    experiment: "провести сценарный тест окончания лимита во время активного обращения"
  },
  addon: {
    title: "Дополнительный пакет",
    phrase: "пакеты дополнительного объёма",
    detail: "Пиковый объём обращений приобретается сверх базового тарифа.",
    experiment: "проверить, может ли клиент заранее спрогнозировать пиковую доплату"
  },
  deep: {
    title: "Сложный режим",
    phrase: "отдельный режим для сложных обращений",
    detail: "Типовые обращения входят в основу, длинные и сложные сценарии тарифицируются отдельно.",
    experiment: "попросить клиента и команду продукта независимо классифицировать сложность одних и тех же обращений"
  }
};

const supportReactions = {
  access: {
    limit: {
      quote: "Что произойдёт с нашим клиентом, если он обратится за помощью после окончания лимита?",
      insight: "Поддержку нельзя просто остановить: непринятое обращение влияет уже не только на покупателя тарифа, но и на его клиентов.",
      question: "Как контролировать объём обращений так, чтобы ни одно начатое обращение не осталось без понятного продолжения?"
    },
    addon: {
      quote: "Почему именно в самый загруженный месяц поддержка внезапно становится дороже?",
      insight: "Доплата возникает в момент пика, когда отказаться от сервиса или сократить обращения особенно сложно.",
      question: "Может ли клиент заранее оценить расходы в обычный и пиковый месяц и выбрать подходящий запас объёма?"
    },
    deep: {
      quote: "Кто решает, что обращение сложное, и почему за него нужно платить отдельно?",
      insight: "Если правило сложности непрозрачно, клиент может заподозрить, что продукт сам назначает более дорогую категорию.",
      question: "Можно ли до обработки обращения определить сложность по признакам, которые одинаково понимают клиент и поставщик?"
    }
  },
  operation: {
    limit: {
      quote: "Я плачу за каждое обращение. Почему тогда есть ещё и общий лимит?",
      insight: "Клиент одновременно платит за каждое использование и следит за общим потолком.",
      question: "Нужны ли оба ограничения или одно из них можно убрать, сохранив контроль затрат?"
    },
    addon: {
      quote: "Нам выгоднее собрать несколько вопросов в одно обращение или отправить их отдельно?",
      insight: "Цена может заставить клиента искусственно объединять или дробить вопросы вместо удобной работы.",
      question: "Можно ли однозначно определить одно обращение так, чтобы правило оплаты не меняло поведение пользователей?"
    },
    deep: {
      quote: "Длинный диалог считается одним обращением или более дорогим сложным случаем?",
      insight: "Количество обращений не показывает, сколько работы потребовалось для решения каждого из них.",
      question: "Какой заранее понятный признак действительно отличает обычное обращение от сложного?"
    }
  },
  result: {
    limit: {
      quote: "Если проблема не решена, почему это обращение уже уменьшило лимит оплаченных результатов?",
      insight: "Клиент ожидает платить только за решённые вопросы, но продукту всё равно приходится тратить ресурсы на неудачные попытки.",
      question: "В какой момент результат считается достигнутым и что происходит с обращениями, которые не удалось решить?"
    },
    addon: {
      quote: "Если человек снова обратился с той же проблемой, это новый платный результат или продолжение старого?",
      insight: "Без временного правила одно и то же решение можно посчитать несколько раз.",
      question: "В течение какого срока повторное обращение считается продолжением прежней нерешённой проблемы?"
    },
    deep: {
      quote: "Если и простой, и сложный вопрос в итоге решены, почему один результат стоит дороже?",
      insight: "Высокие затраты продукта не всегда означают, что клиент получил более ценный результат.",
      question: "За какую заметную для клиента дополнительную пользу он готов платить больше в сложном режиме?"
    }
  }
};

const scenarios = {
  contracts: { segments, values, pricing, guardrails, reactions },
  marketing: {
    segments: marketingSegments,
    values: marketingValues,
    pricing: marketingPricing,
    guardrails: marketingGuardrails,
    reactions: marketingReactions
  },
  support: {
    segments: supportSegments,
    values: supportValues,
    pricing: supportPricing,
    guardrails: supportGuardrails,
    reactions: supportReactions
  }
};

const cardEmojis = {
  product: { contracts: "📄", marketing: "✍️", support: "🎧" },
  segment: {
    contracts: { small: "⚖️", enterprise: "🏢", agency: "🤝" },
    marketing: { small: "👥", enterprise: "🏢", agency: "📣" },
    support: { small: "💬", enterprise: "☎️", outsourcer: "🎧" }
  },
  value: {
    contracts: { speed: "⚡", risk: "🛡️", completion: "✅" },
    marketing: { speed: "⚡", variation: "🎨", completion: "✅" },
    support: { speed: "⚡", resolution: "✅", capacity: "🙌" }
  },
  pricing: { access: "🔓", operation: "🔁", result: "🎯" },
  guardrail: { limit: "📏", addon: "➕", deep: "🔬" }
};

function currentScenario() {
  return scenarios[state.product] || scenarios.contracts;
}

function resetState() {
  Object.assign(state, { step: 0, product: null, segment: null, value: null, pricing: null, guardrail: null, revisionUsed: false });
}

function choiceCard(kicker, title, detail, action, value, emoji) {
  return `<button class="choice-button" type="button" data-action="${action}" data-value="${value}">
    <span class="choice-kicker">${kicker}</span>
    <strong>${emoji ? `<span class="choice-emoji" aria-hidden="true">${emoji}</span>` : ""}${title}</strong>
    <span>${detail}</span>
  </button>`;
}

function progress(step, title) {
  const percent = Math.round((step / 8) * 100);
  return `<div class="progress-wrap">
    <div class="progress-meta"><span>Этап ${step} из 8</span><span>${title}</span></div>
    <div class="progress-track" role="progressbar" aria-label="Прогресс квеста" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>
  </div>`;
}

function stageExplainer(text) {
  return `<div class="stage-explainer">
    <span class="stage-explainer-label">Что делаем сейчас</span>
    <p>${text}</p>
  </div>`;
}

function contextStrip() {
  const scenario = currentScenario();
  const items = [];
  if (state.product) items.push(`<span class="context-chip"><strong>Продукт:</strong> ${products[state.product].short}</span>`);
  if (state.segment) items.push(`<span class="context-chip"><strong>Клиент:</strong> ${scenario.segments[state.segment].short}</span>`);
  if (state.value) items.push(`<span class="context-chip"><strong>Ценность:</strong> ${scenario.values[state.value].title}</span>`);
  if (state.pricing) items.push(`<span class="context-chip"><strong>Оплата:</strong> ${scenario.pricing[state.pricing].title}</span>`);
  if (state.guardrail) items.push(`<span class="context-chip"><strong>Защита:</strong> ${scenario.guardrails[state.guardrail].title}</span>`);
  return items.length ? `<div class="context-strip">${items.join("")}</div>` : "";
}

function renderHome() {
  screen.innerHTML = `<div class="home-screen">
    <div class="home-hero">
      <h1>Собери тариф для AI-продукта</h1>
      <p class="lead">Игра о том, как монетизировать AI-функциональность, не потеряв клиентскую ценность и не сделав экономику продукта неуправляемой.</p>
      <div class="hero-actions">
        <button class="primary-button" type="button" data-action="intro">Начать квест</button>
      </div>
    </div>
    <section class="why-section" aria-label="Почему эта тема важна сейчас">
      <p class="eyebrow">Почему сейчас</p>
      <div class="why-compact">
        <strong>AI-функции становятся частью продукта, но привычные тарифы не всегда покрывают их переменные затраты.</strong>
        <p>Чем активнее клиент пользуется AI, тем выше себестоимость. Задача квеста — найти понятный способ оплаты и удержать экономику продукта.</p>
      </div>
    </section>
  </div>`;
}

function renderIntro() {
  screen.innerHTML = `<p class="eyebrow">Перед стартом</p>
    <h2>Вы отвечаете за запуск AI-продукта</h2>
    <p class="lead">Задача — собрать тариф, который понятен клиенту и помогает продукту контролировать растущие затраты на AI.</p>
    <div class="intro-steps" aria-label="Шаги квеста">
      <article class="intro-step">
        <span class="intro-number">1</span>
        <div><h3>Выбрать основу</h3><p>Определить продукт, клиента и главную ценность, за которую клиент готов платить.</p></div>
      </article>
      <article class="intro-step">
        <span class="intro-number">2</span>
        <div><h3>Собрать тариф</h3><p>Выбрать единицу оплаты и увидеть, как она влияет на использование продукта и себестоимость.</p></div>
      </article>
      <article class="intro-step">
        <span class="intro-number">3</span>
        <div><h3>Защитить экономику</h3><p>Ограничить дорогие сценарии и проверить, как клиент воспримет получившиеся условия.</p></div>
      </article>
    </div>
    <section class="intro-outcome">
      <p class="eyebrow">Что получится в итоге</p>
      <strong>Карта тарифной гипотезы</strong>
      <p>В ней будут зафиксированы клиент, ценность, способ оплаты, защита экономики, возможная реакция клиента и главное предположение для проверки.</p>
    </section>
    <div class="hero-actions"><button class="primary-button" type="button" data-action="start">Перейти к выбору продукта</button></div>`;
}

function renderProduct() {
  state.step = 1;
  screen.innerHTML = `${progress(1, "Выбор продукта")}
    <p class="eyebrow">Точка старта</p>
    <h2>Какой AI-продукт запускаем?</h2>
    ${stageExplainer("Выбираем продукт, экономику которого будем разбирать. У каждого продукта свои клиенты, источники затрат и реакции на тарифные решения.")}
    <div class="choice-grid">
      ${Object.entries(products).map(([id, item]) => choiceCard(item.costDriver, item.title, item.detail, "product", id, cardEmojis.product[id])).join("")}
    </div>`;
}

function renderSegment() {
  state.step = 2;
  const scenario = currentScenario();
  screen.innerHTML = `${progress(2, "Клиент")}${contextStrip()}
    <p class="eyebrow">Кому продаем</p>
    <h2>Выбираем клиента</h2>
    ${stageExplainer("Один продукт создаёт разную ценность и разную нагрузку в разных сегментах. Выбираем клиента, чтобы дальше принимать решения в конкретном контексте.")}
    <div class="choice-grid">
      ${Object.entries(scenario.segments).map(([id, item]) => choiceCard(item.priority, item.title, item.detail, "segment", id, cardEmojis.segment[state.product][id])).join("")}
    </div>`;
}

function renderValue() {
  state.step = 3;
  const scenario = currentScenario();
  screen.innerHTML = `${progress(3, "Клиентская ценность")}${contextStrip()}
    <p class="eyebrow">Обещание продукта</p>
    <h2>Какую ценность ставим в центр?</h2>
    ${stageExplainer("Фиксируем главное обещание клиенту. Позже именно оно должно объяснить, почему тариф устроен так, а не иначе.")}
    <div class="choice-grid">
      ${Object.entries(scenario.values).map(([id, item]) => choiceCard("Ценность", item.title, item.detail, "value", id, cardEmojis.value[state.product][id])).join("")}
    </div>`;
}

function renderPricing() {
  state.step = 4;
  const scenario = currentScenario();
  screen.innerHTML = `${progress(4, "Модель оплаты")}${contextStrip()}
    <p class="eyebrow">Гипотеза монетизации</p>
    <h2>За что платит клиент?</h2>
    ${stageExplainer("Для AI-решений уже сложился формат монетизации через потребление токенов. Но клиент не должен разбираться в токенах и вычислениях, чтобы понимать цену. Поэтому внутреннюю AI-экономику переводим в понятную клиенту единицу оплаты — доступ, операцию или результат.")}
    <div class="choice-grid">
      ${Object.entries(scenario.pricing).map(([id, item]) => choiceCard("Единица оплаты", item.title, item.detail, "pricing", id, cardEmojis.pricing[id])).join("")}
    </div>`;
}

function renderLoadEvent() {
  state.step = 5;
  const item = currentScenario().pricing[state.pricing];
  screen.innerHTML = `${progress(5, "Первый месяц")}${contextStrip()}
    <div class="event-layout-linear">
      <h2>${item.eventTitle}</h2>
      ${stageExplainer("Смотрим, как выбранная модель оплаты изменила реальное поведение пользователей и себестоимость после запуска. Это последствие вашего решения, а не случайная проверка.")}
      <div class="event-visual">
        <span class="event-icon" aria-hidden="true">↗</span>
        <div><p class="eyebrow">Через месяц после запуска</p><p class="event-quote">${item.eventQuote}</p></div>
      </div>
      <div class="decision-summary product-meaning"><strong>Продуктовый смысл</strong><p>${item.eventDetail}</p></div>
      <div class="hero-actions"><button class="primary-button" type="button" data-action="continue-guardrail">Защитить экономику</button></div>
    </div>`;
}

function renderGuardrail() {
  state.step = 6;
  const scenario = currentScenario();
  screen.innerHTML = `${progress(6, "Защита экономики")}${contextStrip()}
    <p class="eyebrow">Ответ на нагрузку</p>
    <h2>Как контролируем дорогой сценарий?</h2>
    ${stageExplainer("Выбираем способ контролировать дорогие сценарии использования. Задача — сделать затраты управляемыми, не наказывая клиента за получение ценности.")}
    <div class="choice-grid">
      ${Object.entries(scenario.guardrails).map(([id, item]) => choiceCard("Механизм", item.title, item.detail, "guardrail", id, cardEmojis.guardrail[id])).join("")}
    </div>`;
}

function renderReaction() {
  state.step = 7;
  const reaction = currentScenario().reactions[state.pricing][state.guardrail];
  screen.innerHTML = `${progress(7, "Реакция клиента")}${contextStrip()}
    <div class="event-layout-linear">
      <h2>Что может быть непонятно клиенту</h2>
      ${stageExplainer("Разбираем реакцию клиента на выбранный способ защиты экономики: насколько понятно ограничение, как оно связано с тарифом и сохраняется ли обещанная ценность продукта.")}
      <div class="event-visual alert">
        <span class="event-icon" aria-hidden="true">“</span>
        <div><p class="eyebrow">Реакция клиента</p><p class="event-quote">${reaction.quote}</p></div>
      </div>
      <div class="decision-summary reaction-explanation">
        <p><strong>Что стоит за реакцией:</strong> ${reaction.insight}</p>
        <p><strong>Что нужно уточнить:</strong> ${reaction.question}</p>
      </div>
      <div class="hero-actions">
        <button class="primary-button" type="button" data-action="finish">Сохранить тариф</button>
        <button class="secondary-button" type="button" data-action="revise">Изменить</button>
      </div>
    </div>`;
}

function renderRevision() {
  const scenario = currentScenario();
  screen.innerHTML = `${progress(7, "Одна корректировка")}${contextStrip()}
    <p class="eyebrow">Решение после вопроса клиента</p>
    <h2>Можно изменить только один элемент</h2>
    ${stageExplainer("Вопрос клиента не означает, что тариф неправильный. Можно сохранить решение для проверки или изменить одну часть тарифа, если именно она кажется источником непонимания.")}
    <div class="revision-grid">
      <section class="revision-group">
        <h3>За что платит клиент</h3>
        <div class="revision-options">
          ${Object.entries(scenario.pricing).map(([id, item]) => `<button class="revision-option" type="button" data-action="revise-pricing" data-value="${id}" ${id === state.pricing ? "disabled" : ""}>${item.title}</button>`).join("")}
        </div>
      </section>
      <section class="revision-group">
        <h3>Как ограничиваем дорогие сценарии</h3>
        <div class="revision-options">
          ${Object.entries(scenario.guardrails).map(([id, item]) => `<button class="revision-option" type="button" data-action="revise-guardrail" data-value="${id}" ${id === state.guardrail ? "disabled" : ""}>${item.title}</button>`).join("")}
        </div>
      </section>
    </div>
    <div class="hero-actions"><button class="secondary-button" type="button" data-action="reaction">Не менять</button></div>`;
}

function tariffConclusion() {
  const valueConclusions = {
    access: "клиент получает постоянный доступ, но связь цены с конкретным результатом нужно объяснить",
    operation: "цена растёт вместе с использованием, но оплачиваемая операция должна быть однозначно связана с пользой",
    result: "оплата напрямую связана с пользой, если клиент и команда одинаково понимают, что считается результатом"
  };
  const freedomConclusions = {
    limit: "использование ограничено включённым объёмом, поэтому момент и последствия окончания лимита должны быть понятны заранее",
    addon: "работу можно продолжить за доплату, если дополнительный объём и его цена предсказуемы",
    deep: "базовые сценарии остаются доступными, а дорогие переходят в отдельный режим, если граница между режимами прозрачна"
  };
  const economyConclusions = {
    limit: "затраты удерживаются лимитом, но он не должен обрывать важную работу клиента",
    addon: "дополнительные затраты компенсируются доплатой за объём, но она не должна выглядеть штрафом за активное использование",
    deep: "дорогие сценарии оплачиваются отдельно, если клиент видит их дополнительную ценность"
  };
  return {
    value: valueConclusions[state.pricing],
    freedom: freedomConclusions[state.guardrail],
    economy: economyConclusions[state.guardrail]
  };
}

function renderResult() {
  state.step = 8;
  const scenario = currentScenario();
  const product = products[state.product];
  const segment = scenario.segments[state.segment];
  const value = scenario.values[state.value];
  const price = scenario.pricing[state.pricing];
  const guard = scenario.guardrails[state.guardrail];
  const reaction = scenario.reactions[state.pricing][state.guardrail];
  const conclusion = tariffConclusion();
  screen.innerHTML = `${progress(8, "Карта гипотезы")}
    ${stageExplainer("Собираем решения в гипотезу, которую ещё нужно проверить на реальных клиентах. Итог не оценивает игрока и не называет тариф правильным или неправильным.")}
    <div class="result-layout">
      <section class="hypothesis-card">
        <p class="eyebrow">Ваша гипотеза запуска</p>
        <p class="hypothesis-formula">Для сегмента <strong>«${segment.short}»</strong> <strong>${product.title}</strong> помогает <strong>${value.short}</strong>. Клиент платит за <strong>${price.phrase}</strong>, а затраты контролируются через <strong>${guard.phrase}</strong>.</p>
        <ul class="insight-list">
          <li><strong>Почему решение может сработать:</strong> оно учитывает приоритет клиента «${segment.priority}» и связывает пользу продукта с условиями оплаты.</li>
          <li><strong>Что может смутить клиента:</strong> ${reaction.insight}</li>
          <li><strong>Что проверить до запуска:</strong> ${state.revisionUsed ? guard.experiment : price.experiment}.</li>
        </ul>
      </section>
      <aside class="debrief-card">
        <p class="eyebrow">Вопрос для обсуждения</p>
        <p class="debrief-question">${reaction.question}</p>
        <div class="tariff-conclusion">
          <strong class="conclusion-title">Вывод по тарифу</strong>
          <p class="conclusion-item"><span class="conclusion-emoji" aria-hidden="true">🎯</span><span><b>Клиентская ценность</b>${conclusion.value}.</span></p>
          <p class="conclusion-item"><span class="conclusion-emoji" aria-hidden="true">🕊️</span><span><b>Свобода использования</b>${conclusion.freedom}.</span></p>
          <p class="conclusion-item"><span class="conclusion-emoji" aria-hidden="true">⚙️</span><span><b>Контроль экономики</b>${conclusion.economy}.</span></p>
        </div>
        <div class="hero-actions"><button class="primary-button" type="button" data-action="restart">Новая сессия</button></div>
      </aside>
    </div>`;
}

function route(action, value) {
  switch (action) {
    case "home": resetState(); renderHome(); break;
    case "intro": renderIntro(); break;
    case "start": renderProduct(); break;
    case "product": state.product = value; renderSegment(); break;
    case "segment": state.segment = value; renderValue(); break;
    case "value": state.value = value; renderPricing(); break;
    case "pricing": state.pricing = value; renderLoadEvent(); break;
    case "continue-guardrail": renderGuardrail(); break;
    case "guardrail": state.guardrail = value; renderReaction(); break;
    case "revise": renderRevision(); break;
    case "reaction": renderReaction(); break;
    case "revise-pricing": state.pricing = value; state.revisionUsed = true; renderResult(); break;
    case "revise-guardrail": state.guardrail = value; state.revisionUsed = true; renderResult(); break;
    case "finish": renderResult(); break;
    case "restart": resetState(); renderIntro(); break;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  route(target.dataset.action, target.dataset.value);
});

renderHome();
