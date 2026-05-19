export interface SendSmsRequest {
	/**
	 * номер отправителя / имя отправителя (альфа-имя)
	 */
	number?: string
	/**
	 * номер получателя
	 */
	destination: string
	/**
	 * текст сообщения
	 */
	text: string
}

export interface SendSmsResponse {
	/**
	 * идентификатор сообщения
	 */
	message_id: string
	/**
	 * идентификатор шаблона, указывается при отправке шаблонированного SMS
	 */
	template_resource_id: string
}
