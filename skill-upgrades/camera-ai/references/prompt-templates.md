# قوالب الأوامر لتوليد لقطات سايا

الأوامر بالإنجليزي لأن مولّدات الصور بتفهمها أدق. أداة المستخدم: **Gemini** (احفظها بـ`brand-profile.md` إذا تغيرت).
اقرأ `gemini-consistency.md` أول: **الأمر الكامل للصورة الأم بس، وكل شي بعدها تعديل.**

أرفق دايماً: **ورقة الشخصية** + **صورة الاستوديو** (بأول رسالة بكل محادثة)، و**الصورة الأم** بكل تعديل.

## 1) كتلة قفل الشخصية (حرفياً، بلا تغيير)
```
Saya: a young Arab woman with a soft round face, warm hazel eyes, natural skin tone,
and thin round metal-frame glasses. She wears a neatly wrapped hijab. Keep exactly the same
face, eyes, nose, lips, glasses and proportions as in the attached character sheet.
She must look like the same person, not a similar one.
```

## 2) كتلة قفل الاستوديو (حرفياً)
```
Setting: Saya's tech studio, exactly as in the attached studio reference: a wooden desk with a
silver laptop and a black microphone arm, a black mesh office chair, a back wall of hexagonal
cyan and blue LED panels, tall black metal shelves on the left with plants, a blue neon
lightning-bolt sign, a YouTube plaque and small robot figurines, warm shelf lamps, a window with
horizontal blinds and a softbox on the right, a blue shaggy rug. Keep the furniture, props and
layout unchanged.
```

## 3) كتلة الإطلالة (بتتغير لكل ريل، ثابتة جوا الريل)
```
Outfit: [loose, modest outfit, e.g. an oversized cream knit sweater with thin brown stripes
and a brown hijab]. Natural, realistic fabric folds.
```

## 4) الأمر الكامل للصورة الأم (بجمل، مش قائمة كلمات)
```
A photorealistic vertical 9:16 photograph of Saya [action, e.g. sitting at her desk and
explaining something with one hand raised], looking directly into the lens with a
[natural excited smile]. [Character lock] [Outfit]. [Studio lock].

Camera: [shot size, e.g. medium shot from the chest up], straight-on from the front,
[height, e.g. slightly below eye level], [lens, e.g. 50mm], moderate depth of field so the
studio stays recognisable but softer than her.

Lighting: soft neutral key light from a large softbox at 45 degrees on the right of the frame,
gentle fill, a subtle cyan rim light from the hexagon panels behind her, warm amber bokeh from
the shelf lamps. Natural, true-to-life skin tones with real skin texture. Small soft
catchlights in her eyes, natural subtle reflections on the glasses with her eyes clearly
visible. Background accents are cyan and deep blue only.

Composition: her face in the upper-middle third with comfortable headroom, both hands
anatomically correct, the chest area calm for on-screen captions.

This image will be animated as a talking avatar, so keep her face frontal, the lips clearly
visible and the jaw unobstructed. The laptop screen shows a plain soft gradient.
One single photograph, no text, no logos, only Saya in the frame.
```
(المقاطع اللي بين `[ ]` بتتعبى من `angles.md` و`lighting.md`.)

## 5) قوالب التعديل (رسالة وحدة = تغيير واحد)
كل تعديل بيبدأ بـ"Using the provided image" وبيخلص بقفل الباقي.

**تعبير:**
```
Using the provided image, change only her facial expression to [surprised / thoughtful /
confident smile]. Keep her face identity, glasses, hijab, outfit, pose, hands, camera angle,
framing, lighting and the studio exactly the same.
```
**إيماءة اليد:**
```
Using the provided image, change only her [right] hand to [a relaxed open-palm explaining
gesture at chest height]. The other hand stays on the desk. Keep everything else identical.
```
**إطلالة:**
```
Using the provided image, change only her outfit to [new outfit]. Keep her face, glasses,
hijab style, pose, camera angle, lighting and the studio exactly the same.
```
**زاوية الكاميرا:**
```
Using the provided image, show the same moment photographed from [a three-quarter angle from
the right side of the room, near the softbox]. Same person, same outfit, same expression, same
studio and the same lighting direction, as if the photographer simply moved the camera.
She still looks into the lens. Vertical 9:16.
```
**حجم اللقطة (إذا القص ما بيكفي للدقة):**
```
Using the provided image, reframe as a [close-up from the shoulders up] with an [85mm]
look and the neon hexagons as soft bokeh. Keep everything about her identical.
```

## 6) بدل النفي: اكتب البديل الإيجابي
| بدل | اكتب |
|---|---|
| no purple | `background accents are cyan and deep blue only` |
| no text | `the laptop screen shows a plain soft gradient`، `one single photograph` |
| no extra people | `only Saya in the frame` |
| no distorted hands | `both hands anatomically correct with five natural fingers` |
| no over-smoothing | `real skin texture, natural pores` |
| no tight clothes | `loose, modest, well-fitted clothing` |
| no glare on glasses | `eyes clearly visible through the lenses` |

إذا شي غلط ضل يرجع رغم البديل، ضيف سطر نفي واحد قصير بالآخر (مثلاً `Avoid: extra fingers, changed glasses`)، مش قائمة طويلة.

## 7) أمثلة كتلة الكاميرا حسب الزوايا المعتمدة
- **01 الرئيسية المتوسطة:** `medium shot from the chest to the waist, straight-on, slightly below eye level, 50mm, the hexagon wall evenly behind her`
- **04 الواسعة للمكتب:** `wide shot from slightly above, showing the whole desk, chair, rug and the edges of the shelves, 35mm, Saya centered and smaller in frame`
- **08 ثلاثة أرباع من اليمين:** `three-quarter angle from the right side of the room near the softbox, 30 to 45 degrees, she turns her face to the lens, the shelves and the neon bolt behind her`
- **13 عند الرفوف:** `medium shot from the front, chest height, standing beside the left shelves with one hand resting on a shelf, the neon bolt and YouTube plaque visible`
- **14 مستندة على المكتب:** `medium-wide shot from the front at chest height, standing and leaning on the front edge of the desk with her hands on it, the hexagon wall behind her`
