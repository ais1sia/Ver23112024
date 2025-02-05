import { LANGUAGES } from "../../config/languages"
import { LEVELS } from "../../config/levels"
import { TAGS } from "../../config/tags"
import { useAddNewMaterialMutation } from "./materialsApiSlice"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RichTextEditor from "../../config/RichTextEditor"

const NewMaterial = () => {
  const [addNewMaterial, { isLoading, isSuccess, isError, error }] =
    useAddNewMaterialMutation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('English')
  const [short, setShort] = useState('')
  const [level, setLevel] = useState("A1")
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [tags, setTags] = useState(["general"])

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setLanguage("")
      setShort("")
      setLevel("")
      setContent("")
      setImageUrl("")
      setSourceUrl("")
      setTags([])
      navigate("/dash/materials")
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onLanguageChanged = (e) => setLanguage(e.target.value)
  const onShortChanged = (e) => setShort(e.target.value)
  const onLevelChanged = (e) => setLevel(e.target.value)
  const onContentChanged = (newContent) => {
    setContent(newContent)
  }
  const onImageUrlChanged = (e) => setImageUrl(e.target.value)
  const onSourceUrlChanged = (e) => setSourceUrl(e.target.value)

  const onTagsChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setTags(values)
  };

  const canSave = !isLoading;

  const onSaveMaterialClicked = async (e) => {
    e.preventDefault()
    console.log("Saving material...", {
      title,
      language,
      short,
      level,
      content,
      imageUrl,
      sourceUrl,
      tags,
    })
    if (canSave) {
      try {
        const response = await addNewMaterial({
          title,
          language,
          short,
          level,
          content,
          imageUrl,
          sourceUrl,
          tags,
        })
        console.log("Material created successfully:", response);
      } catch (err) {
        console.error("Failed to create material:", err);
      }
    } else {
      console.warn("Cannot save material. Check validation or state.")
    }
  }

  const languageOptions = Object.values(LANGUAGES).map((language) => {
    return (
      <option key={language} value={language}>
        {" "}
        {language}
      </option>
    )
  })
  
  const levelOptions = Object.values(LEVELS).map((level) => {
    return (
      <option key={level} value={level}>
        {" "}
        {level}
      </option>
    )
  })

  const tagsOptions = Object.values(TAGS).map((tag) => {
    return (
      <option key={tag} value={tag}>
        {" "}
        {tag}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen";
  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveMaterialClicked}>
        <div className="form__title-row">
          <h2>New Material</h2>
        </div>

        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          className="form__input"
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="language">
          Language:
        </label>
        <select
          id="language"
          name="language"
          className="form__select"
          multiple={false}
          size="1"
          value={language}
          onChange={onLanguageChanged}
        >
          {languageOptions}
        </select>

        <label className="form__label" htmlFor="short">
          Short description:
        </label>
        <input
          className="form__input"
          id="short"
          name="short"
          type="short"
          value={short}
          onChange={onShortChanged}
        />

        <label className="form__label" htmlFor="level">
          Level:
        </label>
        <select
          id="level"
          name="level"
          className="form__select"
          multiple={false}
          size="3"
          value={level}
          onChange={onLevelChanged}
        >
          {levelOptions}
        </select>

        <RichTextEditor initialContent={content} onContentChange={onContentChanged} />
        <label className="form__label" htmlFor="setImageUrl">
          Image Url:
        </label>
        <input
          className="form__input"
          id="setImageUrl"
          name="imageUrl"
          type="imageUrl"
          value={imageUrl}
          onChange={onImageUrlChanged}
        />
        <label className="form__label" htmlFor="sourceUrl">
          Linked resource:
        </label>
        <input
          className="form__input"
          id="sourceUrl"
          name="sourceUrl"
          type="sourceUrl"
          value={sourceUrl}
          onChange={onSourceUrlChanged}
        />

        <label className="form__label" htmlFor="tags">
          Tags:
        </label>
        <select
          id="tags"
          name="tags"
          className="form__select"
          multiple={true}
          size="3"
          value={tags}
          onChange={onTagsChanged}
        >
          {tagsOptions}
        </select>
        <button className="final-submit-btn" title="Save" disabled={!canSave}>
          SAVE
        </button>
      </form>
    </>
  );
};

export default NewMaterial;
