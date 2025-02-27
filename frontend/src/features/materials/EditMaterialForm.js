import {
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from "./materialsApiSlice"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LANGUAGES } from "../../config/languages"
import { LEVELS } from "../../config/levels"
import { TAGS } from "../../config/tags"
import PulseLoader from 'react-spinners/PulseLoader'
// import RichTextEditor from "../../config/RichTextEditor"


const EditMaterialForm = ({ material }) => {
  const [updateMaterial, { isLoading, isSuccess, isError, error }] =
    useUpdateMaterialMutation()

  const [
    deleteMaterial,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteMaterialMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(material.title)
  const [language, setLanguage] = useState(material.language)
  const [short, setShort] = useState(material.short)
  const [level, setLevel] = useState("A1")
  const [content, setContent] = useState(material.content)
  const [imageUrl, setImageUrl] = useState(material.imageUrl)
  const [sourceUrl, setSourceUrl] = useState(material.sourceUrl)
  const [tags, setTags] = useState(material.tags)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setLanguage("")
      setShort("")
      setLevel("")
      setContent("")
      setImageUrl("")
      setSourceUrl("")
      setTags([])
      navigate("/dash/materials");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onLanguageChanged = (e) => setLanguage(e.target.value)
  const onShortChanged = (e) => setShort(e.target.value)
  const onLevelChanged = (e) => setLevel(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  // const onContentChanged = (newContent) => {
  //   setContent(newContent)
  // }
  const onImageUrlChanged = (e) => setImageUrl(e.target.value)
  const onSourceUrlChanged = (e) => setSourceUrl(e.target.value)

  const onTagsChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )
    setTags(values)
  }

  const onSaveMaterialClicked = async (e) => {
    e.preventDefault()
    await updateMaterial({
      id: material.id,
      title,
      language,
      short,
      level,
      content,
      imageUrl,
      sourceUrl,
      tags,
    })
  }

  const onDeleteMaterialClicked = async () => {
    await deleteMaterial({ id: material.id });
  };

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

  let canSave = !isLoading

  const errClass = isError || isDelError ? "errmsg" : "offscreen"

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ""

  if (isLoading) {
    return <PulseLoader color={"#FFF"} />
  }

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={onSaveMaterialClicked}>
        <div className="form__title-row">
          <h2>Edit Material</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteMaterialClicked}
              type="button"
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
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
          value={level}
          onChange={onLevelChanged}
        >
          {levelOptions}
        </select>

        <label className="form__label" htmlFor="content">
          Content:
        </label>
        <input
          className="form__input"
          id="content"
          name="content"
          type="text"
          autoComplete="off"
          value={content}
          onChange={onContentChanged}
        />
        {/* <RichTextEditor initialContent={content} onContentChange={onContentChanged} /> */}


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
          Source:
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
          multiple={true}
          size="4"
          value={tags}
          onChange={onTagsChanged}
        >
          {tagsOptions}
        </select>
      </form>
    </>
  )
}

export default EditMaterialForm
