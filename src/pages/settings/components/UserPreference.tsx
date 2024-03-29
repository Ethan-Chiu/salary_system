import React, {
	createContext,
	PropsWithChildren,
	useState,
	useContext,
	useEffect,
} from "react";

export const UserPreferenceContext = createContext({
	language: "en",
	setLanguage: (v: string) => {},
});

export const UserPreferenceProvider = ({ children }: PropsWithChildren<{}>) => {
	const [lang, setLang] = useState<string | null>();

	useEffect(() => {
		setLang("zh");
	}, []);

	const setLanguage = (newLanguage: string) => {
		setLang(newLanguage);
	};

	const contextValue: any = {
		language: lang,
		setLanguage: setLang,
	};

	return (
		<UserPreferenceContext.Provider value={contextValue}>
			{children}
		</UserPreferenceContext.Provider>
	);
};

export const useUserPreference = () => {
	return useContext(UserPreferenceContext);
};

export default <></>;
