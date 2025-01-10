import { LEVELS } from "../../config/levels";
import { TAGS } from "../../config/tags";
import { useAddNewMaterialMutation } from "./materialsApiSlice";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewMaterialForm = () => {
  const [addNewMaterial, { isLoading, isSuccess, isError, error }] =
    useAddNewMaterialMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState("A1");
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(["general"]);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setLanguage("");
      setLevel("");
      setContent("");
      setTags([]);
      navigate("/dash/materials");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onLanguageChanged = (e) => setLanguage(e.target.value);
  const onLevelChanged = (e) => setLevel(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const onTagsChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setTags(values);
  };

  const canSave = !isLoading;

  const onSaveMaterialClicked = async (e) => {
    e.preventDefault();
    console.log("Saving material...", {
      title,
      language,
      level,
      content,
      tags,
    });
    if (canSave) {
      try {
        const response = await addNewMaterial({
          title,
          language,
          level,
          content,
          tags,
        });
        console.log("Material created successfully:", response);
      } catch (err) {
        console.error("Failed to create material:", err);
      }
    } else {
      console.warn("Cannot save material. Check validation or state.");
    }
  };

  const levelOptions = Object.values(LEVELS).map((level) => {
    return (
      <option key={level} value={level}>
        {" "}
        {level}
      </option>
    );
  });

  const tagsOptions = Object.values(TAGS).map((tag) => {
    return (
      <option key={tag} value={tag}>
        {" "}
        {tag}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveMaterialClicked}>
        <div className="form__title-row">
          <h2>New Material</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="title">
          Title: <span className="nowrap">[3-20 letters]</span>
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
        <input
          className="form__input"
          id="language"
          name="language"
          type="language"
          value={language}
          onChange={onLanguageChanged}
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

        <label className="form__label" htmlFor="content">
          Content:
        </label>
        <input
          className="form__input"
          id="content"
          name="content"
          type="content"
          value={content}
          onChange={onContentChanged}
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
      </form>
    </>
  );
};

export default NewMaterialForm;
